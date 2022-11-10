import React from "react"

type Props = JSX.IntrinsicElements["form"]

const Form = (props: Props) => {
  const { children, ...formProps } = props
  return (
    <form {...formProps}>
      {children}
      <style jsx>{`
        form > :global(.form-group) {
          padding-inline: 0.75em;
        }
      `}</style>
    </form>
  )
}

export default Form
