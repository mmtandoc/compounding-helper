import _ from "lodash"
import { useMemo } from "react"
import {
  Controller,
  ControllerProps,
  FieldArrayPath,
  FieldValues,
  Path,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form"

import { FormGroup, Input } from "components/ui/forms"

type FieldPresetInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> = {
  name: `${TFieldArrayName}.${number}`
  formMethods: UseFormReturn<TFieldValues>
  arrayMethods: UseFieldArrayReturn<TFieldValues, TFieldArrayName>
  valueInput: ControllerProps<TFieldValues>["render"]
}

const FieldPresetInput = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
>(
  props: FieldPresetInputProps<TFieldValues, TFieldArrayName>,
) => {
  const { name, formMethods, arrayMethods, valueInput: ValueInput } = props

  const { register } = formMethods

  const presetValue = formMethods.watch(`${name}.value` as Path<TFieldValues>)

  const { arrayPath, index } = useMemo(
    () =>
      name.match(/(?<arrayPath>.*)\.(?<index>\d+)/)?.groups as {
        arrayPath: string
        index: string
      },
    [name],
  )

  return (
    <FormGroup row>
      <Input
        {...register(`${name}.label` as Path<TFieldValues>, {
          deps: _.range(arrayMethods.fields.length)
            .filter((i2) => i2 !== Number(index))
            .reduce(
              (arr, i2) => [...arr, `${arrayPath}.${i2}.label`],
              [] as string[],
            ),
        })}
        placeholder={presetValue}
        fullWidth
      />
      <Controller
        control={formMethods.control}
        name={`${name}.value` as Path<TFieldValues>}
        render={ValueInput}
        rules={{
          deps: _.range(arrayMethods.fields.length).reduce(
            (arr, i2) => [...arr, `${arrayPath}.${i2}.label`],
            [] as string[],
          ),
        }}
      />
    </FormGroup>
  )
}

export default FieldPresetInput
