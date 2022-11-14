import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { Merge } from "type-fest"

import ErrorContainer from "./ErrorContainer"

type InputAttributes = JSX.IntrinsicElements["input"]

type Props = Merge<InputAttributes, UseFormRegisterReturn> & {
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { fullWidth, ...inputProps } = props
  inputProps.className = `${inputProps.className ?? ""}${
    fullWidth ? " full-width" : ""
  }`
  return (
    <>
      <ErrorContainer>
        <input {...inputProps} ref={ref}>
          {props.children}
        </input>
      </ErrorContainer>
      <style jsx>{`
        input.full-width {
          width: 100%;
        }
      `}</style>
    </>
  )
})

Input.displayName = "Input"

export default Input
