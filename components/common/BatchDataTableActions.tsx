import { ReactNode } from "react"

import { BatchPrintButton } from "components/common/BatchPrintButton"

const BatchDataTableActions = <TData,>({
  selectedRows,
  renderDocument,
  documentTitle,
  printButtonText,
}: {
  selectedRows: TData[]
  renderDocument: (data: TData) => ReactNode
  documentTitle?: string
  printButtonText?: string
}) => (
  <>
    {selectedRows.length > 0 && (
      <div className="batch-table-actions">
        <BatchPrintButton
          documentTitle={documentTitle}
          documents={selectedRows.map(renderDocument)}
        >
          {printButtonText ?? "Print selected rows"}
        </BatchPrintButton>
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

export default BatchDataTableActions
