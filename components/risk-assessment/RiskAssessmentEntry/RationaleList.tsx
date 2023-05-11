import _ from "lodash"
import React, { useEffect } from "react"
import {
  DeepPartialSkipArrayKey,
  FieldError,
  UseControllerProps,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useController,
  useWatch,
} from "react-hook-form"
import useSWR from "swr"

import { DotJotList } from "components/ui/forms"
import { NullableRiskAssessmentFields } from "lib/fields"
import { JsonError } from "types/common"
import { SdsWithRelations } from "types/models"

interface RationaleListProps
  extends Omit<UseControllerProps<NullableRiskAssessmentFields>, "name"> {
  id?: string
  error?: FieldError
  readOnly?: boolean
  disabled?: boolean
  className?: string

  register: UseFormRegister<NullableRiskAssessmentFields>
  setValue: UseFormSetValue<NullableRiskAssessmentFields>
  getValues: UseFormGetValues<NullableRiskAssessmentFields>
}

const RationaleList = ({
  control,
  register,
  setValue,
  getValues,
}: RationaleListProps) => {
  const allValues = useWatch<NullableRiskAssessmentFields>({
    control,
    defaultValue:
      control?._defaultValues as DeepPartialSkipArrayKey<NullableRiskAssessmentFields>,
  })
  const ingredients = allValues.compound?.ingredients

  //TODO: Handle error
  const sdsUrls =
    ingredients
      ?.map((ingredient) =>
        ingredient?.sdsId ? `/api/sds/${ingredient.sdsId}` : null,
      )
      .filter<string>(_.isString) ?? []

  const { data: safetyDatasheets, error: sdsesError } = useSWR<
    SdsWithRelations[],
    JsonError
  >(sdsUrls.length > 0 ? sdsUrls : null)

  if (sdsesError) {
    console.log(sdsesError)
  }

  //Autoupdate automatic rationale list
  useEffect(() => {
    const autoRationale = determineAutoRationale(
      allValues,
      safetyDatasheets ?? [],
    )

    if (
      autoRationale.toString() ===
      allValues.rationaleList?.automatic?.toString?.()
    ) {
      return
    }

    register("rationaleList")
    setValue("rationaleList", {
      automatic: autoRationale,
      additional: getValues("rationaleList.additional"),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(allValues),
    register,
    setValue,
    getValues,
    safetyDatasheets,
  ])

  const {
    field: { onChange, value },
  } = useController({
    control,
    name: "rationaleList",
  })

  //TODO: Improve loading handling
  if (sdsUrls.length > 0 && !safetyDatasheets) {
    return <div>Loading...</div>
  }

  const handleChange = (items: { text: string; readOnly?: boolean }[]) => {
    onChange(
      items.reduce(
        (result, item) => {
          ;(item.readOnly ? result.automatic : result.additional).push(
            item.text,
          )
          return result
        },
        { automatic: [] as string[], additional: [] as string[] },
      ),
    )
  }

  return (
    <DotJotList
      items={[
        ...(value?.automatic?.map(
          (t): { text: string; readOnly?: boolean } => ({
            text: t as string,
            readOnly: true,
          }),
        ) ?? []),
        ...(value?.additional?.map(
          (t): { text: string; readOnly?: boolean } => ({
            text: t as string,
            readOnly: false,
          }),
        ) ?? []),
      ]}
      onChange={handleChange}
    />
  )
}

const autoRationalesFunctions: ((
  values: DeepPartialSkipArrayKey<NullableRiskAssessmentFields>,
  sdses: SdsWithRelations[],
) => string | null)[] = [
  (values, sdses) => {
    if (!sdses || !values.compound?.ingredients) {
      return null
    }

    const allNonNiosh = values.compound.ingredients.every((ing) => {
      const sds = sdses.find((sds) => sds.id === ing?.sdsId)
      return sds ? _.get(sds, "product.chemical.nioshTable", 0) < 0 : true
    })

    if (allNonNiosh) {
      return "Non-NIOSH ingredients."
    }

    return null
  },
  (values) =>
    values.isPreparedOccasionally === true ? "Low frequency." : null,
  (values) =>
    values.isSmallQuantity
      ? `Small quantity is being used` +
        (values.averagePreparationAmount?.quantity &&
        values.averagePreparationAmount?.unit
          ? ` (${values.averagePreparationAmount?.quantity} ${values.averagePreparationAmount?.unit})`
          : "")
      : null,
  (values) =>
    values.isConcentrationHealthRisk === false ? "Low concentration." : null,
  (values) =>
    values.haveAppropriateFacilities === true
      ? "Have appropriate facilities."
      : null,
  (values) =>
    values.complexity
      ? `Compounding complexity is ${values.complexity}.`
      : null,
  (values) => {
    if (!values.compound?.ingredients) {
      return null
    }

    const [creamCount, ointmentCount] = values.compound?.ingredients?.reduce(
      (counts, ing) => {
        if (ing?.physicalForm === "cream") {
          counts[0]++
        } else if (ing?.physicalForm === "ointment") {
          counts[1]++
        }
        return counts
      },
      [0, 0],
    ) ?? [0, 0]

    if (creamCount === 0 && ointmentCount === 0) {
      return null
    }

    const forms = []
    if (creamCount > 0) {
      forms.push("cream")
    }

    if (ointmentCount > 0) {
      forms.push("ointment")
    }

    if (creamCount + ointmentCount === values.compound?.ingredients?.length) {
      return `Health hazards minimized by ${forms.join("/")} formulation`
    }

    return `Health hazards minimized by use of commercial ${forms.join("/")}`
  },
  (values) => {
    const requiredPPE: string[] = []
    const ppe = values.ppe
    if (ppe?.mask?.required) {
      requiredPPE.push("Mask" + (ppe.mask.type ? ` (${ppe.mask.type})` : ""))
    }

    if (ppe?.eyeProtection?.required) {
      requiredPPE.push("Eye protection")
    }

    if (ppe?.coat?.required) {
      requiredPPE.push("Coat" + (ppe.coat.type ? ` (${ppe.coat.type})` : ""))
    }

    if (ppe?.gloves?.required) {
      requiredPPE.push(
        "Gloves" + (ppe.gloves.type ? ` (${ppe.gloves.type})` : ""),
      )
    }

    if (ppe?.other) {
      requiredPPE.push(ppe?.other)
    }

    if (requiredPPE.length === 0) {
      return null
    }

    return `Safety risks to compounding staff minimized by PPE: ${requiredPPE.join(
      ", ",
    )}`
  },
]

const determineAutoRationale = (
  fields: DeepPartialSkipArrayKey<NullableRiskAssessmentFields>,
  safetyDatasheets: SdsWithRelations[],
  hidden: number[] = [],
) => {
  const items = []

  let i = 0
  for (const autoRationalesFunction of autoRationalesFunctions) {
    if (hidden.includes(i)) {
      continue
    }

    const result = autoRationalesFunction(fields, safetyDatasheets)
    if (result) {
      items.push(result)
    }
    i++
  }

  return items
}

export default RationaleList
