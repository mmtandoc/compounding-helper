import { Row, RowData } from "@tanstack/react-table"
import Link from "next/link"

import Button from "../Button"
import RowActions from "./RowActions"

const DataRowActions = <TData extends RowData>(props: {
  row: Row<TData>
  getViewUrl: (data: TData) => string
  getEditUrl: (data: TData) => string
}) => {
  const data = props.row.original
  return (
    <RowActions>
      <Link href={props.getViewUrl(data)}>
        <Button size="small" theme="primary">
          View
        </Button>
      </Link>
      <Link href={props.getEditUrl(data)}>
        <Button size="small">Edit</Button>
      </Link>
    </RowActions>
  )
}

export default DataRowActions
