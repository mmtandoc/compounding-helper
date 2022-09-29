import _ from "lodash"
import React from "react"
import { Get } from "type-fest"
import { TableColumn } from "./Table"
import { Property as CSSProperty } from "csstype"

type Props<TData> = {
  columns: TableColumn<TData>[]
  data: TData[]
  backgroundColor?: CSSProperty.Color
}

const TableBody = <TData,>(props: Props<TData>) => {
  const { columns, data } = props

  const get = (object: TData, path: string): Get<TData, string> =>
    _.get(object, path)

  return (
    <tbody>
      {data.map((r, i) => (
        <tr key={i}>
          {columns.map((c, i) => (
            <td key={i}>
              {(c?.renderCell ?? ((v: any) => v.toString()))?.(
                get(r, c.accessorPath ?? ""),
                r,
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody