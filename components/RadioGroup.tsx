import React from "react"
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form"

interface RHFRadioGroupProps<T>
  extends UseControllerProps<T>,
    Omit<RadioGroupProps, "onChange" | "onBlur" | "ref"> {
  name: FieldPath<T>
}

export const RHFRadioGroup = <T extends FieldValues>(
  props: RHFRadioGroupProps<T>,
) => {
  const { name, rules, control, radioOptions, readOnly, className, disabled } =
    props

  const { field } = useController({
    control,
    name,
    rules,
  })

  return (
    <RadioGroup
      onChange={(e) => {
        field.onChange(e.target.value)
      }}
      inputRef={field.ref}
      onBlur={field.onBlur}
      name={field.name}
      radioOptions={radioOptions}
      selectedValue={field.value}
      readOnly={readOnly}
      className={className}
      disabled={disabled}
    />
  )
}

interface RadioGroupProps {
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  inputRef?: React.LegacyRef<HTMLInputElement>
  radioOptions: [string | number, string][]
  readOnly?: boolean
  disabled?: boolean
  className?: string
  selectedValue?: string
}

export const RadioGroup = (props: RadioGroupProps) => {
  const {
    onChange,
    onBlur,
    inputRef: ref,
    name,
    radioOptions,
    readOnly,
    disabled,
    className,
    selectedValue,
  } = props

  return (
    <div className={`radio-group row ${className ?? ""}`}>
      {radioOptions.map(([value, label], i) => {
        return (
          <label
            key={i}
            className={`${disabled ? "disabled" : ""} ${
              readOnly ? "readOnly" : ""
            }`}
          >
            <input
              type="radio"
              name={name}
              onChange={onChange}
              ref={ref}
              onBlur={onBlur}
              value={value}
              readOnly={readOnly}
              checked={selectedValue === value}
              onClick={(e) => readOnly && e.preventDefault()}
              disabled={disabled}
            />
            <span>{label}</span>
          </label>
        )
      })}
      <style jsx>{`
        div.radio-group {
          display: flex;
        }
        label {
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}
