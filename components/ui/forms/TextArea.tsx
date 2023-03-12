import _ from "lodash"
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { UseFormRegisterReturn, useFormContext } from "react-hook-form"
import { Merge } from "type-fest"

import { ErrorContainer } from "components/ui/forms"

type TextAreaAttributes = JSX.IntrinsicElements["textarea"]

type Props = (
  | TextAreaAttributes
  | Merge<TextAreaAttributes, Partial<UseFormRegisterReturn>>
) & {
  autoResize?: boolean
  fullWidth?: boolean
}

const TextArea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const {
    autoResize = false,
    fullWidth = false,
    ...textAreaProps
  } = _.omit(props, "ref")
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
  const [currentScrollHeight, setCurrentScrollHeight] = useState(
    textAreaRef.current?.scrollHeight ?? null,
  )

  useImperativeHandle(ref, () => {
    if (textAreaRef.current) {
      console.log("setCurrentScrollHeight")
      setCurrentScrollHeight(textAreaRef.current.scrollHeight)
    }

    return textAreaRef.current as HTMLTextAreaElement
  })

  const [value, setValue] = useState(textAreaProps.value)

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        setValue(e.target.value)
      }
      return textAreaProps?.onChange?.(e)
    },
    [autoResize, textAreaProps],
  )

  useEffect(() => {
    const MIN_TEXTAREA_HEIGHT = 40
    if (!autoResize || !textAreaRef.current || !currentScrollHeight) {
      return
    }

    // Reset height - important to shrink on delete
    textAreaRef.current.style.height = "inherit"
    // Set height
    textAreaRef.current.style.height = `${
      Math.max(textAreaRef.current.scrollHeight, MIN_TEXTAREA_HEIGHT) + 2
    }px`
  }, [autoResize, value, currentScrollHeight])

  const hasFormContext = !!useFormContext() as boolean

  if (autoResize) {
    textAreaProps.className = `${textAreaProps.className ?? ""} autoresize`
  }

  if (fullWidth) {
    textAreaProps.className = `${textAreaProps.className ?? ""} full-width`
  }

  return (
    <>
      <ConditionalWrapper condition={hasFormContext} wrapper={ErrorContainer}>
        <textarea {...textAreaProps} onChange={onChange} ref={textAreaRef} />
      </ConditionalWrapper>
      <style jsx global>{`
        textarea {
          &.autoresize {
            resize: none;
            overflow: hidden;
          }

          &.full-width {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
})

TextArea.displayName = "TextArea"

const ConditionalWrapper = ({
  condition,
  wrapper: Wrapper,
  children,
}: {
  condition: boolean
  wrapper: React.ElementType
  children: ReactNode
}) => (condition ? <Wrapper>{children}</Wrapper> : <>{children}</>)

export default TextArea
