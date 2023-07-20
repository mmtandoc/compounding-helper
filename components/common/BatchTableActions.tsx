import { ReactNode } from "react"

const BatchTableActions = ({
  children,
  visible = true,
}: {
  children: ReactNode
  visible?: boolean
}) => {
  if (!visible) return null

  return (
    <div className="batch-table-actions">
      {children}
      <style jsx>{`
        .batch-table-actions {
          display: flex;
          justify-content: end;
          margin-left: auto;
          margin-right: 0;
        }
      `}</style>
    </div>
  )
}

export default BatchTableActions
