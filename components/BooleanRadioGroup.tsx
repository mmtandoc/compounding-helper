import React from "react"
import {
  FieldError,
  FieldValues,
  Path,
  PathValue,
  useController,
  UseControllerProps,
  useFormContext,
  Validate,
} from "react-hook-form"
import ErrorContainer from "./common/forms/ErrorContainer"

interface RHFBooleanRadioGroupProps<T extends FieldValues>
  extends UseControllerProps<T> {
  id?: string
  error?: FieldError
  readOnly?: boolean
  disabled?: boolean
  className?: string
  direction?: "row" | "col"
}

export const RHFBooleanRadioGroup = <TFieldValues extends FieldValues>(
  props: RHFBooleanRadioGroupProps<TFieldValues>,
) => {
  const formMethods = useFormContext<TFieldValues>()
  const {
    control = formMethods.control,
    name,
    rules,
    readOnly = false,
    disabled = false,
    className,
    direction = "row",
  } = props
  let customValidate:
    | Validate<PathValue<TFieldValues, Path<TFieldValues>>>
    | Record<string, Validate<PathValue<TFieldValues, Path<TFieldValues>>>>
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

  return (
    <ErrorContainer>
      <BooleanRadioGroup
        onChange={(e) => {
          field.onChange(e.target.value === "yes")
        }}
        inputRef={field.ref}
        onBlur={field.onBlur}
        name={field.name}
        direction={direction}
        className={className}
        disabled={disabled}
        selectedValue={field.value}
        readOnly={readOnly}
      />
    </ErrorContainer>
  )
}

type BooleanRadioGroupProps = {
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  inputRef?: React.LegacyRef<HTMLInputElement>
  direction?: string
  className?: string
  disabled?: boolean
  selectedValue?: boolean | null
  readOnly?: boolean
}

export const BooleanRadioGroup = ({
  name,
  onChange,
  onBlur,
  inputRef: ref,
  direction = "row",
  className,
  disabled = false,
  selectedValue,
  readOnly = false,
}: BooleanRadioGroupProps) => {
  const options = [
    { label: "Yes", stringValue: "yes", value: true },
    { label: "No", stringValue: "no", value: false },
  ]

  return (
    <div className={`boolean-radio-group ${direction} ${className ?? ""}`}>
      {options.map((option, index) => (
          <label
          key={index}
            className={`${disabled ? "disabled" : ""} ${
              readOnly ? "readOnly" : ""
            }`}
          >
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
      ))}
      <style jsx>{`
        .boolean-radio-group {
          display: flex;
          flex-direction: ${direction === "col" ? "column" : direction};
        }

        .boolean-radio-group > :global(label) {
          display: block;
        }
      `}</style>
    </div>
  )
}
