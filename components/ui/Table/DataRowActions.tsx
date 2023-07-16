import { Row, RowData } from "@tanstack/react-table"
import Link from "next/link"
import { ReactNode } from "react"

import Button from "../Button"
import RowActions from "./RowActions"

const DataRowActions = <TData extends RowData>(props: {
  row: Row<TData>
  viewButton: { getUrl: (data: TData) => string; value?: ReactNode }
  editButton?: { getUrl: (data: TData) => string; value?: ReactNode }
}) => {
  const data = props.row.original
  const { viewButton, editButton } = props
  return (
    <RowActions>
      <Link href={viewButton.getUrl(data)}>
        <Button size="small" theme="primary">
          {viewButton?.value ?? "View"}
        </Button>
      </Link>
      {editButton && (
        <Link href={editButton.getUrl(data)}>
          <Button size="small">{editButton?.value ?? "Edit"}</Button>
        </Link>
      )}
    </RowActions>
  )
}

export default DataRowActions
