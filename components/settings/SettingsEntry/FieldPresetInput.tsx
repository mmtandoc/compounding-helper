import {
  Controller,
  ControllerProps,
  FieldArrayPath,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form"

import { FormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"

type FieldPresetInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> = {
  name: `${TFieldArrayName}.${number}`
  formMethods: UseFormReturn<TFieldValues>
  valueInput: ControllerProps<TFieldValues>["render"]
}

const FieldPresetInput = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
>(
  props: FieldPresetInputProps<TFieldValues, TFieldArrayName>,
) => {
  const { name, formMethods, valueInput: ValueInput } = props

  const { register } = formMethods

  const presetValue = formMethods.watch(`${name}.value` as Path<TFieldValues>)

  return (
    <FormGroup row>
      <Input
        {...register(`${name}.label` as Path<TFieldValues>)}
        placeholder={presetValue}
        fullWidth
      />
      <Controller
        control={formMethods.control}
        name={`${name}.value` as Path<TFieldValues>}
        render={ValueInput}
      />
    </FormGroup>
  )
}

export default FieldPresetInput
