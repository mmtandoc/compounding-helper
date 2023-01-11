import React from "react"

type Props = JSX.IntrinsicElements["form"]

const Form = (props: Props) => {
  const { children, ...formProps } = props
  return (
    <form {...formProps}>
      {children}
      <style jsx>{`
        form {
          > :global(.form-group) {
            padding-inline: 0.75em;
          }

          > :global(*) {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </form>
  )
}

export default Form
