import React, { useEffect } from "react"
import {
  FieldError,
  FieldValues,
  Path,
  PathValue,
  useController,
  UseControllerProps,
  Validate,
} from "react-hook-form"

interface RHFBooleanRadioGroupProps<T> extends UseControllerProps<T> {
  id?: string
  error?: FieldError
  readOnly?: boolean
  disabled?: boolean
  className?: string
  direction?: "row" | "col"
}

export const RHFBooleanRadioGroup = <T extends FieldValues>({
  control,
  name,
  rules,
  readOnly = false,
  disabled = false,
  className,
  direction = "row",
}: RHFBooleanRadioGroupProps<T>) => {
  let customValidate:
    | Validate<PathValue<T, Path<T>>>
    | Record<string, Validate<PathValue<T, Path<T>>>>
    | undefined

  // If rules.required is true, then create custom validate function for workaround
  //https://github.com/react-hook-form/react-hook-form/issues/6757#issuecomment-939429340
  if (rules?.required) {
    customValidate = {
      required: (value: unknown) => {
        return typeof value === "boolean"
      },
    }

    if (rules?.validate !== undefined) {
      switch (typeof rules.validate) {
        case "function":
          customValidate.custom = rules.validate
          break
        case "object":
          customValidate = { ...customValidate, ...rules.validate }
          break
        default:
          break
      }
    }
  }

  const { field } = useController({
    control,
    name,
    rules: {
      ...rules,
      validate: customValidate ?? rules?.validate,
      required: false,
    },
  })

  const [value, setValue] = React.useState<boolean | undefined>(field.value)

  /*
  useEffect(() => {
    if (value !== valueString) {
      setValue(valueString)
    }
  }, [value, valueString])
  */

  return (
    <BooleanRadioGroup
      onChange={(e) => {
        setValue(e.target.value === "yes")
        field.onChange(e.target.value === "yes")
      }}
      inputRef={field.ref}
      onBlur={field.onBlur}
      name={field.name}
      direction={direction}
      className={className}
      disabled={disabled}
      selectedValue={value}
      readOnly={readOnly}
    />
  )
}

type BooleanRadioGroupProps = {
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  inputRef?: React.LegacyRef<HTMLInputElement>
  direction: string
  className: string | undefined
  disabled: boolean
  selectedValue: boolean | undefined
  readOnly: boolean
}

export const BooleanRadioGroup = ({
  name,
  onChange,
  onBlur,
  inputRef: ref,
  direction,
  className,
  disabled,
  selectedValue,
  readOnly,
}: BooleanRadioGroupProps) => {
  const options = [
    { label: "Yes", stringValue: "yes", value: true },
    { label: "No", stringValue: "no", value: false },
  ]

  return (
    <div className={`boolean-radio-group ${direction} ${className ?? ""}`}>
      {options.map((option, index) => (
        <div key={index}>
          <label className={disabled ? "disabled" : ""}>
            <input
              name={name}
              onChange={onChange}
              ref={ref}
              onBlur={onBlur}
              type="radio"
              checked={option.value === selectedValue}
              value={option.stringValue}
              readOnly={readOnly}
              disabled={disabled}
            />
            <span>{option.label}</span>
          </label>
        </div>
      ))}
      <style jsx>{`
        .boolean-radio-group {
          display: flex;
          flex-direction: ${direction === "col" ? "column" : direction};
        }
      `}</style>
    </div>
  )
}
