import DotJotList from "components/common/forms/DotJotList"
import { RHFRadioGroup } from "components/RadioGroup"
import React from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import form from "styles/form"
import { DataEntryComponent } from "types/common"
import { ChemicalFields } from "types/fields"
import { NullPartialDeep } from "types/util"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"

export type NullPartialChemicalFields = NullPartialDeep<
  ChemicalFields,
  { ignoreKeys: "id" }
>

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
        <input type="text" {...register("name", { required: true })} />
      </label>
      <label className="form-group">
        <span>CAS number:</span>
        <div className="row">
          <input
            type="text"
            {...register("casNumber", {
              required: !hasNoCasNumber,
              disabled: hasNoCasNumber,
              /* pattern: /[0-9]{4-7}-[0-9]{2}-[0-9]/, */
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
          control={control}
          rules={{ required: true }}
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
