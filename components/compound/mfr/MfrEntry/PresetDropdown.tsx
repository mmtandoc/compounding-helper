import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  PathValue,
  UseFormReturn,
} from "react-hook-form"

import { Button, Dropdown, DropdownMenu, DropdownToggle } from "components/ui"
import {
  NullPartialFieldArrayPresetMultipleFields,
  NullPartialFieldArrayPresetSingleFields,
  NullPartialFieldPresetFields,
} from "lib/fields"
import { GetElementType } from "types/util"

export enum PresetType {
  Array,
  Single,
  MultiArray,
}

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
  type: PresetType.Array
  options: NullPartialFieldArrayPresetSingleFields<GetElementType<
    FieldPathValue<TFieldValues, TFieldName>
  > | null>[]
}

interface ArrayMultiPresetDropdownProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends PresetDropdownPropsBase<TFieldValues, TFieldName> {
  type: PresetType.MultiArray
  options: NullPartialFieldArrayPresetMultipleFields<GetElementType<
    FieldPathValue<TFieldValues, TFieldName>
  > | null>[]
}

interface NonArrayPresetDropdownProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends PresetDropdownPropsBase<TFieldValues, TFieldName> {
  type: PresetType.Single
  options: NullPartialFieldPresetFields<
    FieldPathValue<TFieldValues, TFieldName>
  >[]
}

type PresetDropdownProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> =
  | NonArrayPresetDropdownProps<TFieldValues, TFieldName>
  | ArrayPresetDropdownProps<TFieldValues, TFieldName>
  | ArrayMultiPresetDropdownProps<TFieldValues, TFieldName>

const PresetDropdown = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: PresetDropdownProps<TFieldValues, TFieldName>,
) => {
  const { className, name, label, formMethods, type, options } = props

  const currentValue = formMethods.watch(name)

  return (
    <>
      <Dropdown className={`preset-dropdown ${className ?? ""}`}>
        <Button size="small">
          <DropdownToggle>{label}</DropdownToggle>
        </Button>
        <DropdownMenu>
          {options.map((option, i) => {
            const optionValue = (
              option as { value: FieldPathValue<TFieldValues, TFieldName> }
            ).value
            const optionLabel = (option as { label?: string }).label
            return (
              <Button
                key={i}
                onClick={() => {
                  if (type !== PresetType.Single) {
                    const newValue = [
                      ...(formMethods.getValues(name) ?? []),
                    ] as FieldPathValue<TFieldValues, TFieldName>

                    if (type === PresetType.MultiArray) {
                      newValue.push(...optionValue)
                    } else {
                      newValue.push(optionValue)
                    }

                    formMethods.setValue(name, newValue)
                  } else {
                    const newValue =
                      typeof optionValue === "object"
                        ? {
                            // Keep previous values that are undefined in the preset option
                            ...(formMethods.getValues(name) ?? {}),
                            ...optionValue,
                          }
                        : optionValue
                    formMethods.setValue(name, newValue)
                  }
                }}
                size="small"
                disabled={
                  Array.isArray(currentValue)
                    ? currentValue.includes(optionValue)
                    : false
                }
              >
                {optionLabel ?? (optionValue as string)}
              </Button>
            )
          })}
        </DropdownMenu>
      </Dropdown>
      <style jsx>{`
        :global(.dropdown) {
          width: fit-content;
          height: min-content;

          :global(.dropdown-menu) {
            min-width: 100%;
          }
        }
      `}</style>
    </>
  )
}

export default PresetDropdown
