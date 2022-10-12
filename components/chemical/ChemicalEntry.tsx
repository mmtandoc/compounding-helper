import DotJotList from "components/common/forms/DotJotList"
import Input from "components/common/forms/Input"
import { RHFRadioGroup } from "components/RadioGroup"
import { NullPartialChemicalFields } from "lib/fields"
import { Controller, UseFormReturn } from "react-hook-form"
import form from "styles/form"
import { DataEntryComponent } from "types/common"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"

type Props = {
  formMethods: UseFormReturn<NullPartialChemicalFields>
}

const ChemicalEntry: DataEntryComponent<NullPartialChemicalFields, Props> = (
  props: Props,
) => {
  const { formMethods } = props

  const { register, control, watch, setValue } = formMethods

  const hasNoCasNumber = watch("hasNoCasNumber") as boolean

  useUpdateFieldConditionally({
    updateCondition: hasNoCasNumber === true,
    fields: [[`casNumber`, null]],
    register,
    setValue,
  })

  register("id")
  return (
    <>
      <label className="form-group">
        <span>Chemical name:</span>
        <Input type="text" {...register("name")} />
      </label>
      <label className="form-group">
        <span>CAS number:</span>
        <div className="row">
          <Input
            type="text"
            {...register("casNumber")}
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
      </label>
      <label className="form-group">
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
      </label>
      <label className="form-group">
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
      </label>
      <style jsx global>
        {form}
      </style>
    </>
  )
}

export default ChemicalEntry
