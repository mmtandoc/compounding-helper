import React, { ReactNode } from "react"

type FieldsetProps = JSX.IntrinsicElements["fieldset"] & { legend?: ReactNode }

const Fieldset = (props: FieldsetProps) => {
  const { legend: label, children, ...fieldsetProps } = props
  return (
    <fieldset {...fieldsetProps}>
      {label && <legend>{label}</legend>}
      {children}
      <style jsx>{`
        :global(legend) {
          font-weight: 600;
        }

        fieldset {
          border: var(--border-default);
        }
      `}</style>
    </fieldset>
  )
}

export default Fieldset
