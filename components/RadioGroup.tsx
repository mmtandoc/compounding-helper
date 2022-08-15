import React from "react"
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form"

interface Props<T> {
  name: FieldPath<T>
  id: string
  options: RegisterOptions<T>
  register: UseFormRegister<T>
  radioOptions: [string | number, string][]
  readOnly?: boolean
  className?: string
}
export const RadioGroup = <T extends FieldValues>(props: Props<T>) => {
  const { name, options, register, radioOptions, readOnly, className } = props

  return (
    <div className={`radio-group row ${className ?? ""}`}>
      {radioOptions.map(([value, label], i) => {
        return (
          <label
            key={i}
            className={`${options.disabled ? "disabled" : ""} ${
              readOnly ? "readOnly" : ""
            }`}
          >
            <input
              {...register(name, options)}
              type="radio"
              value={value}
              readOnly={readOnly}
              onClick={(e) => readOnly && e.preventDefault()}
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
