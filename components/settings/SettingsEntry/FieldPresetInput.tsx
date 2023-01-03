import {
  Controller,
  ControllerProps,
  ControllerRenderProps,
  FieldArrayPath,
  FieldArrayWithId,
  FieldValues,
  Path,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form"
import { BiCaretDown, BiCaretUp } from "react-icons/bi"
import { MdClose } from "react-icons/md"

import { FormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"
import IconButton from "components/common/IconButton"

type FieldPresetInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> = {
  name: TFieldArrayName
  field: FieldArrayWithId<TFieldValues, TFieldArrayName>
  index: number
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
  const {
    name,
    index,
    formMethods,
    arrayMethods,
    valueInput: ValueInput,
  } = props

  const { register } = formMethods

  const { fields, swap, remove } = arrayMethods

  const presetValue = formMethods.watch(
    `${name}.${index}.value` as Path<TFieldValues>,
  )

  const PresetValueInput = ({
    field,
  }: {
    field: ControllerRenderProps<TFieldValues>
  }) => (
    <Input {...field} value={(field.value as string | null) ?? ""} fullWidth />
  )

  return (
    <FormGroup>
      <Input
        {...register(`${name}.${index}.label` as Path<TFieldValues>)}
        placeholder={presetValue}
        fullWidth
      />
      <Controller
        control={formMethods.control}
        name={`${name}.${index}.value` as Path<TFieldValues>}
        render={ValueInput}
      />
      <div className="row-actions">
        <IconButton
          title="Move down"
          icon={BiCaretDown}
          disabled={index + 1 === fields.length}
          onClick={() => swap(index, index + 1)}
          size="small"
        />
        <IconButton
          title="Move up"
          icon={BiCaretUp}
          disabled={index === 0}
          onClick={() => swap(index, index - 1)}
          size="small"
        />
        <IconButton
          title="Remove"
          icon={MdClose}
          disabled={fields.length === 1}
          onClick={() => remove(index)}
          size="small"
        />
      </div>
    </FormGroup>
  )
}

export default FieldPresetInput
