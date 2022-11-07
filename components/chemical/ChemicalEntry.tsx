import { useEffect } from "react"
import { Controller, UseFormReturn } from "react-hook-form"

import DotJotList from "components/common/forms/DotJotList"
import { LabelFormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"
import { RHFRadioGroup } from "components/RadioGroup"
import { NullPartialChemicalFields } from "lib/fields"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"
import { DataEntryComponent } from "types/common"

type Props = {
  formMethods: UseFormReturn<NullPartialChemicalFields>
}

const ChemicalEntry: DataEntryComponent<NullPartialChemicalFields, Props> = (
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
        <RHFRadioGroup
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
    </>
  )
}

export default ChemicalEntry
