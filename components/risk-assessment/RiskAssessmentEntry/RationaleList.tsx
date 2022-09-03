import DotJotList from "components/common/forms/DotJotList"
import { NullPartialRiskAssessmentFields } from "components/risk-assessment/RiskAssessmentEntry"
import { useIngredientChemicals } from "components/risk-assessment/RiskAssessmentEntry/helpers"
import React, { useEffect } from "react"
import {
  FieldError,
  useController,
  UseControllerProps,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form"
import { ChemicalAll } from "types/models"

interface RationaleListProps
  extends Omit<UseControllerProps<NullPartialRiskAssessmentFields>, "name"> {
  id?: string
  error?: FieldError
  readOnly?: boolean
  disabled?: boolean
  className?: string

  register: UseFormRegister<NullPartialRiskAssessmentFields>
  setValue: UseFormSetValue<NullPartialRiskAssessmentFields>
  getValues: UseFormGetValues<NullPartialRiskAssessmentFields>
  watch: UseFormWatch<NullPartialRiskAssessmentFields>
}

const RationaleList = ({
  control,
  register,
  setValue,
  getValues,
  watch,
}: RationaleListProps) => {
  const allValues = watch()
  const ingredients = watch("ingredients")

  //TODO: Handle error
  const { data: chemicalsData, error: chemicalError } =
    useIngredientChemicals(ingredients)

  if (chemicalError) {
    console.log(chemicalError)
  }

  //Autoupdate automatic rationale list
  useEffect(() => {
    if (chemicalsData === undefined) {
      return
    }

    register("rationaleList")
    setValue("rationaleList", {
      automatic: determineAutoRationale(allValues, chemicalsData),
      additional: getValues("rationaleList.additional"),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(allValues),
    register,
    setValue,
    getValues,
    chemicalsData,
  ])

  const {
    field: { onChange, value },
  } = useController({
    control,
    name: "rationaleList",
    rules: {
      required: true,
    },
  })

  //TODO: Improve loading handling
  if (!chemicalsData) {
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
  values: NullPartialRiskAssessmentFields,
  chemicals: ChemicalAll[],
) => string | null)[] = [
  (values, chemicals) => {
    if (!chemicals || !values.ingredients) {
      return null
    }

    const allNonNiosh = values.ingredients.every(
      (ing) =>
        chemicals.find((c) => c.id === ing?.chemicalId)?.nioshTable ?? 0 < 0,
    )
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
  (values, chemicals) => {
    if (!chemicals || !values.ingredients) {
      return null
    }

    if (
      !values.ingredients.every((ingredient) =>
        ["cream", "ointment"].includes(ingredient?.physicalForm ?? ""),
      )
    ) {
      return null
    }

    return "Health hazards minimized by cream/ointment formulation"
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
  fields: NullPartialRiskAssessmentFields,
  chemicals: ChemicalAll[],
  hidden: number[] = [],
) => {
  const items = []

  let i = 0
  for (const autoRationalesFunction of autoRationalesFunctions) {
    if (hidden.includes(i)) {
      continue
    }

    const result = autoRationalesFunction(fields, chemicals)
    if (result) {
      items.push(result)
    }
    i++
  }

  return items
}

export default RationaleList
