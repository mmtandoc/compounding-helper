import { ReactNode } from "react"

const RowActions = (props: { children: ReactNode }) => {
  return (
    <div>
      {props.children}
      <style jsx>{`
        div {
          display: flex;
          column-gap: 0.3rem;
          flex-wrap: nowrap;
          margin: 0.2rem 0;

          justify-content: center;
        }
      `}</style>
    </div>
  )
}

export default RowActions
