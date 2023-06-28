import React from "react"

type Props = Omit<JSX.IntrinsicElements["input"], "type" | "children">

const RadioButton = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { ...radioProps } = props

  return (
    <>
      <input type="radio" {...radioProps} ref={ref} />
      <style jsx>{`
        input[type="radio"] {
          appearance: none;
          border-radius: 50%;
          width: var(--radio-size);
          height: var(--radio-size);
          border: solid 2px var(--color-radio-border);
          margin-right: 0.5rem;
          margin-block: 3px 0;
          margin-inline: 5px 3px;
          background-color: var(--color-radio-bg);

          &:hover:not([readOnly]) {
            border-color: var(--color-radio-hover-border);
          }

          &:active:not([readOnly]) {
            border-color: var(--color-radio-active-border);
          }

          &:checked {
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 16 16' fill='%23000' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='5'/%3E%3C/svg%3E");
            background-position: 50%;
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }

          &:disabled {
            border-color: var(--color-radio-disabled-border);
            background-color: var(--color-radio-disabled-bg);
            pointer-events: none;
          }

          &[readOnly] {
            pointer-events: none;
          }

          :global(.invalid) &,
          &.invalid {
            background-color: var(--color-field-invalid-bg) !important;
          }
        }
      `}</style>
    </>
  )
})

RadioButton.displayName = "RadioButton"

export default RadioButton
