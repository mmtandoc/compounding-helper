import React, { useEffect } from "react"
import {
  FieldError,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form"

interface Props<T> extends UseControllerProps<T> {
  id?: string
  error?: FieldError
  readOnly?: boolean
  disabled?: boolean
  className?: string
  direction?: "row" | "col"
}

export const BooleanRadioButtons = <T extends FieldValues>({
  control,
  name,
  id,
  rules,
  readOnly = false,
  disabled = false,
  className,
  direction = "row",
}: Props<T>) => {
  const { field } = useController({
    control,
    name,
    rules,
  })

  const options = [
    { label: "Yes", stringValue: "yes", value: true },
    { label: "No", stringValue: "no", value: false },
  ]

  const valueString =
    field.value === undefined
      ? undefined
      : field.value === true
      ? options[0].stringValue
      : options[1].stringValue

  const [value, setValue] = React.useState<string | undefined>(valueString)

  useEffect(() => {
    if (value !== valueString) {
      setValue(valueString)
    }
  }, [value, valueString])

  return (
    <div className={`boolean-radio-group ${direction} ${className ?? ""}`}>
      {options.map((option, index) => (
        <div key={index}>
          <label className={disabled ? "disabled" : ""}>
            <input
              name={name}
              onChange={(e) => {
                setValue(e.target.value)
                field.onChange(e.target.value === "yes")
              }}
              type="radio"
              checked={option.stringValue === value}
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
