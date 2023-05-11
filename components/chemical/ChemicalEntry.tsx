import { useEffect } from "react"
import { Controller, UseFormReturn } from "react-hook-form"

import {
  DotJotList,
  FormGroup,
  Input,
  LabelFormGroup,
  RhfRadioGroup,
  TextArea,
} from "components/ui/forms"
import { NullableChemicalFields } from "lib/fields"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"
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

  const hasNoCasNumber = watch("hasNoCasNumber") as boolean

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

  register("id")
  return (
    <>
      <LabelFormGroup>
        <span>Chemical name:</span>
        <Input type="text" {...register("name")} />
      </LabelFormGroup>
      <LabelFormGroup>
        <span>CAS number:</span>
        <div className="row">
          <Input
            type="text"
            {...register("casNumber", { disabled: hasNoCasNumber })}
            placeholder="XXXXXXX-YY-Z"
          />
          <label>
            <input
              type="checkbox"
              {...register(`hasNoCasNumber`, { deps: "casNumber" })}
            />
            <span>No CAS number</span>
          </label>
        </div>
      </LabelFormGroup>
      <LabelFormGroup>
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
            />
          )}
        ></Controller>
      </LabelFormGroup>
      <LabelFormGroup>
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
      <FormGroup>
        <label htmlFor="additionalInfo">Additional Info:</label>
        <TextArea
          id="additionalInfo"
          {...register("additionalInfo")}
          autoResize
        />
      </FormGroup>
    </>
  )
}

export default ChemicalEntry
