import { ErrorMessage } from "@hookform/error-message"
import React, { ReactElement, useEffect, useState } from "react"
import {
  FieldError,
  FieldPath,
  FieldValues,
  FormState,
  useFormContext,
} from "react-hook-form"

import Tooltip from "../Tooltip"

type SpanProps = JSX.IntrinsicElements["span"]

interface Props<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> extends SpanProps {
  name?: TFieldName
  fieldState?: {
    invalid: boolean
    isDirty: boolean
    isTouched: boolean
    error?: FieldError | undefined
  }
  formState?: FormState<TFieldValues>
  children: ReactElement
  showErrorMessages?: boolean
}

const ErrorContainer = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>(
  props: Props<TFieldValues, TFieldName>,
) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)

  const {
    children,
    name,
    fieldState,
    formState,
    showErrorMessages = true,
    ...containerProps
  } = props

  const formMethods = useFormContext()

  const inputElement = React.Children.only<ReactElement>(children)

  const inputProps = inputElement.props

  const fieldName: string = name ?? inputProps.name

  const { error } =
    fieldState ??
    formMethods.getFieldState(fieldName, formState ?? formMethods.formState)
  const hasError = !!error

  useEffect(() => {
    setIsInvalid(hasError)
  }, [hasError])

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setIsTooltipVisible(true)
    return inputProps?.onFocus?.(e)
  }

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setIsTooltipVisible(false)
    return inputProps.onBlur(e)
  }

  containerProps.className = containerProps.className ?? "" + " input-container"

  return (
    <span {...containerProps} hidden={inputProps.hidden}>
      {React.cloneElement(inputElement, {
        onFocus: handleFocus,
        onBlur: handleBlur,
        className: `${inputProps.className ?? ""} ${
          isInvalid ? "invalid" : ""
        }`,
      })}
      {showErrorMessages && isTooltipVisible && (
        <ErrorMessage
          name={fieldName}
          errors={(formState ?? formMethods.formState).errors}
          render={({ messages }) => {
            return (
              messages &&
              Object.values(messages).some((m) => typeof m !== "boolean") && (
                <Tooltip
                  visible={isTooltipVisible}
                  style={{ backgroundColor: "#ffc8c8" }}
                >
                  {Object.entries(messages).map(([type, message]) => (
                    <p className="input-error" key={type}>
                      {message}
                    </p>
                  ))}
                </Tooltip>
              )
            )
          }}
        />
      )}
      <style jsx>{`
        .input-container {
          //display: inline-block;
          //position: relative;
        }
      `}</style>
      <style jsx global>{`
        :root {
          --invalid-bg-color: #ffc8c8;
        }

        .input-error {
          margin: 0;
          width: max-content;
        }

        .tooltip {
          font-size: 1.2rem;
          max-width: max-content;
        }
      `}</style>
    </span>
  )
}

export default ErrorContainer
