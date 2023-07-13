import { ReactNode } from "react"

const BatchTableActions = ({
  children,
  selectedRows,
}: {
  children: ReactNode
  selectedRows: unknown[]
}) => (
  <>
    {selectedRows.length > 0 && (
      <div className="batch-table-actions">
        {children}
        <style jsx>{`
          .batch-table-actions {
            display: flex;
            width: 100%;
            justify-content: end;
            margin: 1rem 0;
          }
        `}</style>
      </div>
    )}
  </>
)

export default BatchTableActions
