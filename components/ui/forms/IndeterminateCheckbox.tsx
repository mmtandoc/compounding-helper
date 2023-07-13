import React, { HTMLProps } from "react"

type Props = { indeterminate?: boolean } & HTMLProps<HTMLInputElement>

const IndeterminateCheckbox = ({
  indeterminate,
  className,
  ...rest
}: Props) => {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (indeterminate !== undefined && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return <input type="checkbox" ref={ref} className={className} {...rest} />
}

export default IndeterminateCheckbox
