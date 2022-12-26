import _ from "lodash"
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"
import { UseFormRegisterReturn, useFormContext } from "react-hook-form"
import { Merge } from "type-fest"

import ErrorContainer from "./ErrorContainer"

type TextAreaAttributes = JSX.IntrinsicElements["textarea"]

type Props = (
  | TextAreaAttributes
  | Merge<TextAreaAttributes, Partial<UseFormRegisterReturn>>
) & {
  autoResize?: boolean
}

const TextArea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { autoResize = false, ...textAreaProps } = _.omit(props, "ref")
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => textAreaRef.current as HTMLTextAreaElement)

  const [value, setValue] = useState(textAreaProps.value)
  const [currentScrollHeight, setCurrentScrollHeight] = useState(
    textAreaRef.current?.scrollHeight ?? null,
  )

  const onChange = autoResize
    ? (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value)
        setCurrentScrollHeight(e.target.scrollHeight)
        return textAreaProps?.onChange?.(e)
      }
    : undefined

  useEffect(() => {
    const MIN_TEXTAREA_HEIGHT = 20
    if (!autoResize || !textAreaRef.current) {
      return
    }
    // Reset height - important to shrink on delete
    textAreaRef.current.style.height = "inherit"
    // Set height
    textAreaRef.current.style.height = `${
      Math.max(textAreaRef.current.scrollHeight, MIN_TEXTAREA_HEIGHT) + 1
    }px`
  }, [
    autoResize,
    value,
    currentScrollHeight,
    textAreaRef.current?.scrollHeight,
  ])

  const hasFormContext = !!useFormContext() as boolean

  const ConditionalWrapper = ({
    condition,
    wrapper: Wrapper,
    children,
  }: {
    condition: boolean
    wrapper: React.ElementType
    children: ReactNode
  }) => (condition ? <Wrapper>{children}</Wrapper> : <>{children}</>)

  if (autoResize) {
    textAreaProps.className = `${textAreaProps.className ?? ""} autoresize`
  }

  return (
    <>
      <ConditionalWrapper condition={hasFormContext} wrapper={ErrorContainer}>
        <textarea {...textAreaProps} onChange={onChange} ref={textAreaRef} />
      </ConditionalWrapper>
      <style jsx global>{`
        textarea.autoresize {
          resize: none;
          overflow: hidden;
        }
      `}</style>
    </>
  )
})

TextArea.displayName = "TextArea"

export default TextArea
