import DotJotList from "components/common/forms/DotJotList"
import { RHFRadioGroup } from "components/RadioGroup"
import React, { useEffect } from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import form from "styles/form"
import { ChemicalFields } from "types/fields"
import { NullPartialDeep } from "types/util"

export type NullPartialChemicalFields = NullPartialDeep<ChemicalFields>

type Props = {
  values?: NullPartialChemicalFields
  formMethods: UseFormReturn<NullPartialChemicalFields>
}

const ChemicalEntry = (props: Props) => {
  const { values, formMethods } = props

  const { register, control, reset } = formMethods

  useEffect(() => {
    reset(values)
  }, [reset, values])

  return (
    <>
      <label className="form-group">
        <span>Chemical name:</span>
        <input type="text" {...register("name", { required: true })} />
      </label>
      <label className="form-group">
        <span>CAS number:</span>
        <input
          type="text"
          {...register("casNumber", {
            required: true,
            /* pattern: /[0-9]{4-7}-[0-9]{2}-[0-9]/, */
          })}
          placeholder="XXXXXXX-YY-Z"
        />
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
