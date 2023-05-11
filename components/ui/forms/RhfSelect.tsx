import _ from "lodash"
import React, { ReactNode } from "react"
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form"

import { ErrorContainer, Select } from "components/ui/forms"
import { Merge } from "types/util"

interface Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Merge<
    JSX.IntrinsicElements["select"],
    UseControllerProps<TFieldValues, TName>
  > {
  children: ReactNode
  rules?: Omit<RegisterOptions<TFieldValues, TName>, "valueAsDate">
  initialOption?: { value: string; label: string; disabled?: boolean } | boolean
  fullWidth?: boolean
}

const RhfSelect = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  props: Props<TFieldValues, TName>,
) => {
  const formMethods = useFormContext<TFieldValues>()
  const {
    children,
    control = formMethods.control,
    name,
    rules,
    shouldUnregister,
    fullWidth,
    defaultValue,
    disabled = rules?.disabled,
    ...selectProps
  } = props

  delete selectProps.initialOption

  // If initialOption is true, use blank string for value and label
  const initialOption =
    typeof props.initialOption === "boolean"
      ? props.initialOption
        ? { value: "", label: "" }
        : undefined
      : props.initialOption

  const {
    field: { onChange, onBlur, ref, value },
  } = useController({
    control,
    name,
    shouldUnregister,
    defaultValue,
    rules: _.omit(rules, "setValueAs", "valueAsNumber"),
  })

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    let value: any = e.target.value

    switch (value) {
      case undefined:
        value = undefined
        break
      case initialOption?.value:
        value = null
        break
      default:
        if (rules?.setValueAs) {
          value = rules?.setValueAs(value)
        } else {
          value = rules?.valueAsNumber ? Number(value) : value
        }
        break
    }

    onChange(value)
  }

  return (
    <ErrorContainer showErrorMessages={false}>
      <Select
        {...selectProps}
        name={name}
        onChange={handleChange}
        onBlur={onBlur}
        value={value ?? (initialOption ? initialOption.value : undefined)}
        ref={ref}
        disabled={disabled}
        fullWidth={fullWidth}
      >
        {initialOption && (
          <option
            value={initialOption.value}
            disabled={initialOption.disabled ?? true}
            hidden={initialOption.disabled ?? true}
          >
            {initialOption.label}
          </option>
        )}
        {children}
      </Select>
    </ErrorContainer>
  )
}

export default RhfSelect
