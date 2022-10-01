import React, { ReactNode } from "react"
import {
  FieldValues,
  RegisterOptions,
  useController,
  UseControllerProps,
} from "react-hook-form"
import { Merge, SetRequired } from "type-fest"

interface Props<TFieldValues extends FieldValues>
  extends Merge<
    JSX.IntrinsicElements["select"],
    SetRequired<UseControllerProps<TFieldValues>, "control">
  > {
  children: ReactNode
  rules?: Omit<RegisterOptions<TFieldValues>, "valueAsDate" | "disabled">
  initialOption?: { value: string; label: string; disabled?: boolean }
}

const Select = <TFieldValues extends FieldValues>(
  props: Props<TFieldValues>,
) => {
  const {
    children,
    initialOption,
    control,
    name,
    rules,
    shouldUnregister,
    defaultValue,
    ...selectProps
  } = props

  const {
    field: { onChange, onBlur, ref, value },
  } = useController({
    control,
    name,
    rules,
    shouldUnregister,
    defaultValue,
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
    <select
      {...selectProps}
      name={name}
      onChange={handleChange}
      onBlur={onBlur}
      value={value ?? (initialOption ? initialOption.value : value)}
      ref={ref}
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
  )
}

export default Select
