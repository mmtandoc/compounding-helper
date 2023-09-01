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
import { NullableChemicalFields } from "lib/fields"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"
import { isCentralPharmacy } from "lib/utils"
import { DataEntryComponent } from "types/common"

type Props = {
  formMethods: UseFormReturn<NullableChemicalFields>
}

const ChemicalEntry: DataEntryComponent<NullableChemicalFields, Props> = (
  props: Props,
) => {
  const { formMethods } = props

  const { register, control, watch, setValue, getFieldState, trigger } =
    formMethods

  const additionalInfoArrayMethods = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "additionalInfo", // unique name for your Field Array
  })

  const hasNoCasNumber = watch("hasNoCasNumber") as boolean

  //TODO: Support central admins editing central chemical data
  const pharmacyId = watch("pharmacyId")
  const ownedByCentral = useMemo(
    () => isCentralPharmacy(pharmacyId ?? NaN),
    [pharmacyId],
  )

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
      additionalInfo?.some((val) => isCentralPharmacy(val.pharmacyId ?? NaN)),
    [additionalInfo],
  )

  register("id")
  return (
    <div className="chemical-entry">
      {ownedByCentral && (
        <div className="info">
          The chemical is owned by the central database. Current user can only
          modify their pharmacy&apos;s additional info.
        </div>
      )}
      <Fieldset
        disabled={ownedByCentral}
        style={{ border: "none", padding: "initial" }}
      >
        <LabelFormGroup className={ownedByCentral ? "disabled" : undefined}>
          <span>Chemical name:</span>
          <Input type="text" {...register("name")} />
        </LabelFormGroup>
        <LabelFormGroup className={ownedByCentral ? "disabled" : undefined}>
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
        <LabelFormGroup className={ownedByCentral ? "disabled" : undefined}>
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
                readOnly={ownedByCentral}
              />
            )}
          ></Controller>
        </LabelFormGroup>
        <LabelFormGroup className={ownedByCentral ? "disabled" : undefined}>
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
            key={item.id}
            legend={
              isCentralPharmacy(item.pharmacyId ?? NaN) ? "Central" : "Local"
            }
            disabled={
              isCentralPharmacy(item.pharmacyId ?? NaN) && ownedByCentral
            }
          >
            <TextArea
              {...register(`additionalInfo.${index}.value`)}
              autoResize
              fullWidth
            />
          </Fieldset>
        ))}
        {!hasLocalAdditionalInfo && (
          <Button
            onClick={() =>
              additionalInfoArrayMethods.append({
                value: "",
                pharmacyId: undefined,
              })
            }
            size="small"
          >
            Add local additional info
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
