import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { Merge } from "type-fest"
import ErrorContainer from "./ErrorContainer"

type InputAttributes = JSX.IntrinsicElements["input"]

type Props = Merge<InputAttributes, UseFormRegisterReturn>

const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <ErrorContainer>
      <input {...props} ref={ref}>
        {props.children}
      </input>
    </ErrorContainer>
  )
})

Input.displayName = "Input"

export default Input
