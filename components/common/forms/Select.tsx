import _ from "lodash"
import React, { ReactNode } from "react"
import {
  FieldValues,
  RegisterOptions,
  UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form"
import { Merge } from "type-fest"

import ErrorContainer from "./ErrorContainer"

interface Props<TFieldValues extends FieldValues>
  extends Merge<
    JSX.IntrinsicElements["select"],
    UseControllerProps<TFieldValues>
  > {
  children: ReactNode
  rules?: Omit<RegisterOptions<TFieldValues>, "valueAsDate">
  initialOption?: { value: string; label: string; disabled?: boolean } | boolean
}

const Select = <TFieldValues extends FieldValues>(
  props: Props<TFieldValues>,
) => {
  const formMethods = useFormContext<TFieldValues>()
  const {
    children,
    control = formMethods.control,
    name,
    rules,
    shouldUnregister,
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
      <select
        {...selectProps}
        name={name}
        onChange={handleChange}
        onBlur={onBlur}
        value={value ?? (initialOption ? initialOption.value : undefined)}
        ref={ref}
        disabled={disabled}
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
      </select>
    </ErrorContainer>
  )
}

export default Select
