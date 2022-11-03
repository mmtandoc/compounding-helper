import { Property as CSSProperty } from "csstype"
import _ from "lodash"
import React from "react"
import { Get } from "type-fest"

import { TableColumn } from "./Table"

type Props<TData> = {
  columns: TableColumn<TData>[]
  data: TData[]
  backgroundColor?: CSSProperty.Color
}

const TableBody = <TData,>(props: Props<TData>) => {
  const { columns, data } = props

  const get = (object: TData, path: string): Get<TData, string> =>
    _.get(object, path)

  const renderRow = (rowData: TData | null, index: number) => {
    return (
      <tr key={index}>
        {columns.map((c, i) => (
          <td key={i} style={c.cellStyle}>
            {rowData !== null &&
              (c?.renderCell ?? ((v: any) => v.toString()))?.(
                get(rowData, c.accessorPath ?? ""),
                rowData,
              )}
          </td>
        ))}
      </tr>
    )
  }

  return (
    <tbody>{data.length > 0 ? data.map(renderRow) : renderRow(null, -1)}</tbody>
  )
}

export default TableBody
