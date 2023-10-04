import { subject } from "@casl/ability"
import _ from "lodash"
import { useEffect, useMemo } from "react"
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form"

import { Button } from "components/ui"
import {
  DotJotList,
  Fieldset,
  Input,
  LabelFormGroup,
  RhfRadioGroup,
  TextArea,
} from "components/ui/forms"
import { useAbility } from "lib/contexts/AbilityContext"
import { NullableChemicalFields } from "lib/fields"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"
import ChemicalMapper from "lib/mappers/ChemicalMapper"
import { isCentralPharmacy } from "lib/utils"
import { DataEntryComponent } from "types/common"

type Props = {
  formMethods: UseFormReturn<NullableChemicalFields>
}

//preload("/api/users/current", multiFetcher)

const ChemicalEntry: DataEntryComponent<NullableChemicalFields, Props> = (
  props,
) => {
  const { formMethods, action = "create" } = props

  const { user, error: userError } = useCurrentUser()

  //TODO: Handle error
  if (userError) {
    console.error(userError)
  }

  const {
    register,
    control,
    watch,
    setValue,
    getFieldState,
    trigger,
    getValues,
  } = formMethods

  const additionalInfoArrayMethods = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "additionalInfo", // unique name for your Field Array
    keyName: "key",
  })

  const hasNoCasNumber = watch("hasNoCasNumber") as boolean

  const pharmacyId = watch("pharmacyId", user?.pharmacyId)

  const isCentralUser = useMemo(
    () => isCentralPharmacy(user?.pharmacyId ?? NaN),
    [user?.pharmacyId],
  )

  const ability = useAbility()

  const canFullEdit = useMemo(
    () =>
      ability.can(
        action,
        subject(
          "Chemical",
          ChemicalMapper.toModel({
            pharmacyId: user?.pharmacyId,
            ...getValues(),
          } as any) as any,
        ),
      ),
    [ability.rules, getValues, user?.pharmacyId],
  )

  /* const canFullEdit = useMemo(
    () => (user ? pharmacyId === user.pharmacyId : false),
    [user, pharmacyId],
  ) */

  useUpdateFieldConditionally({
    updateCondition: hasNoCasNumber === true,
    fields: [[`casNumber`, null]],
    register,
    setValue,
  })

  // Fix issue where CAS number field remains invalid until onBlur event of hasNoCasNumber checkbox
  useEffect(() => {
    if (hasNoCasNumber && getFieldState("casNumber").error) {
      trigger("casNumber")
    }
  }, [getFieldState, hasNoCasNumber, trigger])

  const additionalInfo = watch("additionalInfo")

  const hasLocalAdditionalInfo = useMemo(
    () =>
      additionalInfo?.some(
        (val) => (val.pharmacyId ?? user?.pharmacyId) === user?.pharmacyId,
      ),
    [additionalInfo, user?.pharmacyId],
  )

  const chemicalId = watch("id")

  register("id")
  return (
    <div className="chemical-entry">
      {isCentralPharmacy(pharmacyId ?? NaN) && (
        <div className="info">
          The chemical is owned by the central database.
          {!canFullEdit &&
            " Current user can only modify their pharmacy's additional info."}
        </div>
      )}
      <Fieldset
        disabled={!canFullEdit}
        style={{ border: "none", padding: "initial" }}
      >
        <LabelFormGroup className={!canFullEdit ? "disabled" : undefined}>
          <span>Chemical name:</span>
          <Input type="text" {...register("name")} />
        </LabelFormGroup>
        <LabelFormGroup className={!canFullEdit ? "disabled" : undefined}>
          <span>CAS number:</span>
          <div className="row">
            <Input
              type="text"
              {...register("casNumber", {
                disabled: hasNoCasNumber,
              })}
              placeholder="XXXXXXX-YY-Z"
            />
            <label>
              <input
                type="checkbox"
                {...register(`hasNoCasNumber`, {
                  deps: "casNumber",
                })}
              />
              <span>No CAS number</span>
            </label>
          </div>
        </LabelFormGroup>
        <LabelFormGroup className={!canFullEdit ? "disabled" : undefined}>
          <span>Synonyms:</span>
          <Controller
            control={control}
            name="synonyms"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <DotJotList
                items={value?.map((v) => ({ text: v })) ?? []}
                onChange={(items) => onChange(items.map((item) => item.text))}
                ref={ref}
                onBlur={onBlur}
                size={30}
                readOnly={!canFullEdit}
              />
            )}
          ></Controller>
        </LabelFormGroup>
        <LabelFormGroup className={!canFullEdit ? "disabled" : undefined}>
          <span>NIOSH Tables:</span>
          <RhfRadioGroup
            name={"nioshTable"}
            valueAsNumber={true}
            radioOptions={[
              [-1, "None"],
              [1, "Table 1"],
              [2, "Table 2"],
              [3, "Table 3"],
            ]}
          />
        </LabelFormGroup>
      </Fieldset>
      <Fieldset legend="Additional Info">
        {additionalInfoArrayMethods.fields.map((item, index) => (
          <Fieldset
            key={item.key}
            legend={
              // If add. info's pharmacyId is undefined, use user's pharmacyId
              isCentralPharmacy(item.pharmacyId ?? user?.pharmacyId ?? NaN)
                ? "Central"
                : "Local"
            }
            disabled={ability.cannot(
              action,
              subject(
                "AdditionalChemicalInfo",
                _.defaults(item, {
                  chemicalId,
                  pharmacyId: user?.pharmacyId,
                }) as any,
              ),
            )}
          >
            <TextArea
              {...register(`additionalInfo.${index}.value`)}
              autoResize
              fullWidth
            />
          </Fieldset>
        ))}
        {!hasLocalAdditionalInfo &&
          ability.can("create", "AdditionalChemicalInfo") && (
            <Button
              onClick={() =>
                additionalInfoArrayMethods.append({
                  value: "",
                  pharmacyId: undefined,
                })
              }
              size="small"
            >
              Add {isCentralUser ? "central" : "local"} additional info
            </Button>
          )}
      </Fieldset>
      <style jsx>{`
        .chemical-entry .info {
          border: var(--border-default);
          border-radius: 0.4rem;
          background-color: var(--color-scale-blue-300);
          padding: 0.5rem 1rem;
          width: fit-content;
          font-size: var(--font-size-sm);
        }
      `}</style>
    </div>
  )
}

export default ChemicalEntry
