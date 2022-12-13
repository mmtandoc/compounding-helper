import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFormReturn,
} from "react-hook-form"

import Button from "components/common/Button"
import Dropdown, {
  DropdownMenu,
  DropdownToggle,
} from "components/common/Dropdown"

type PresetDropdownPropsBase<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  className?: string
  name: TFieldName
  label: string
  formMethods: UseFormReturn<TFieldValues>
}

interface ArrayPresetDropdownProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends PresetDropdownPropsBase<TFieldValues, TFieldName> {
  isArray: true
  options: {
    label?: string
    value: FieldPathValue<TFieldValues, TFieldName> extends
      | (Array<infer U> | null)
      | Array<infer U>
      ? U
      : never
  }[]
}

interface NonArrayPresetDropdownProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends PresetDropdownPropsBase<TFieldValues, TFieldName> {
  isArray?: false
  options: {
    label?: string
    value: FieldPathValue<TFieldValues, TFieldName>
  }[]
}

type PresetDropdownProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> =
  | NonArrayPresetDropdownProps<TFieldValues, TFieldName>
  | ArrayPresetDropdownProps<TFieldValues, TFieldName>

const PresetDropdown = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: PresetDropdownProps<TFieldValues, TFieldName>,
) => {
  const { className, name, label, formMethods, isArray, options } = props

  const currentValue = formMethods.watch(name)

  return (
    <>
      <Dropdown className={`preset-dropdown ${className ?? ""}`}>
        <Button size="small">
          <DropdownToggle>{label}</DropdownToggle>
        </Button>
        <DropdownMenu>
          {options.map((option, i) => (
            <Button
              key={i}
              onClick={() => {
                if (props.isArray) {
                  formMethods.setValue(name, [
                    ...(formMethods.getValues(name) ?? []),
                    option.value,
                  ] as any)
                } else {
                  formMethods.setValue(name, option.value as any)
                }
              }}
              size="small"
              disabled={
                Array.isArray(currentValue)
                  ? currentValue.includes(option.value)
                  : false
              }
            >
              {option.label ?? (option.value as string)}
            </Button>
          ))}
        </DropdownMenu>
      </Dropdown>
      <style jsx>{`
        :global(.dropdown) {
          width: fit-content;

          :global(.dropdown-menu) {
            min-width: 100%;
          }
        }
      `}</style>
    </>
  )
}

export default PresetDropdown
