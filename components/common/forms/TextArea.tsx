import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { Merge } from "type-fest"
import ErrorContainer from "./ErrorContainer"

type TextAreaAttributes = JSX.IntrinsicElements["textarea"]

type Props = Merge<TextAreaAttributes, UseFormRegisterReturn>

const TextArea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  return (
    <ErrorContainer>
      <textarea {...props} ref={ref}>
        {props.children}
      </textarea>
    </ErrorContainer>
  )
})

TextArea.displayName = "TextArea"

export default TextArea
