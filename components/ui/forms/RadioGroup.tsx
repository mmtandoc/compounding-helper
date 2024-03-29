import React from "react"
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form"

import { ErrorContainer, RadioButton } from "components/ui/forms"

interface RhfRadioGroupProps<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<RadioGroupProps, "onChange" | "onBlur" | "ref"> {
  name: FieldPath<T>
  valueAsNumber?: boolean
}

export const RhfRadioGroup = <TFieldValues extends FieldValues>(
  props: RhfRadioGroupProps<TFieldValues>,
) => {
  const formMethods = useFormContext<TFieldValues>()
  const {
    name,
    rules,
    control = formMethods.control,
    radioOptions,
    readOnly,
    className,
    disabled,
    valueAsNumber = false,
  } = props

  const { field, fieldState, formState } = useController({
    control,
    name,
    rules: {
      ...rules,
      //TODO: Implement disabled without workaround
      // @ts-expect-error: Workaround to allow disabled for controllers, but still works.
      disabled,
    },
  })
  return (
    <ErrorContainer
      name={field.name}
      fieldState={fieldState}
      formState={formState}
    >
      <RadioGroup
        onChange={(e) => {
          field.onChange(
            valueAsNumber ? Number(e.target.value) : e.target.value,
          )
        }}
        ref={field.ref}
        onBlur={field.onBlur}
        name={field.name}
        radioOptions={radioOptions}
        selectedValue={field.value}
        readOnly={readOnly}
        className={className}
        disabled={disabled}
      />
    </ErrorContainer>
  )
}

interface RadioGroupProps {
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  radioOptions: [value: string | number, label: string][]
  readOnly?: boolean
  disabled?: boolean
  className?: string
  selectedValue?: string | number
}

export const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  (props, ref) => {
    const {
      onChange,
      onBlur,
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
                readOnly ? "read-only" : ""
              }`}
            >
              <RadioButton
                name={name}
                onChange={onChange}
                ref={ref}
                onBlur={onBlur}
                value={value}
                readOnly={readOnly}
                checked={
                  selectedValue === value ||
                  Number(selectedValue) === Number(value)
                }
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

          .radio-group > label {
            display: flex;
            align-items: center;
          }

          label {
            white-space: nowrap;
          }
        `}</style>
      </div>
    )
  },
)

RadioGroup.displayName = "RadioGroup"
