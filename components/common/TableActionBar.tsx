import { ReactNode } from "react"

const TableActionBar = (props: { children: ReactNode }) => (
  <div className="table-action-bar">
    {props.children}
    <style jsx>{`
      .table-action-bar {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        column-gap: 0.5rem;
        align-items: center;
      }
    `}</style>
  </div>
)

export default TableActionBar
