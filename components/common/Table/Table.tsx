import _ from "lodash"
import React, { ReactNode, useState } from "react"
import { Get } from "type-fest"
import TableBody from "./TableBody"
import TableHead from "./TableHead"
import { Property as CSSProperty } from "csstype"

export type TableColumn<TData, T = any> = {
  label: string
  accessorPath?: string
  sortable: boolean
  compare?: (a: T, b: T) => number
  renderCell?: (value: T, item: TData) => ReactNode
  cellStyle?: React.CSSProperties
}

type Props<TData> = {
  className?: string
  columns: TableColumn<TData>[]
  data: TData[]
  limit?: number
  offset?: number
  defaultSort?: { path: string; order: "asc" | "desc" }
  backgroundColors?: { head: CSSProperty.Color; body: CSSProperty.Color }
}

const Table = <TData,>(props: Props<TData>) => {
  const { columns, data, defaultSort, className, backgroundColors } = props
  const [tableData, setTableData] = useState<TData[]>(data)

  const get = <T, TPath extends string>(
    object: T,
    path: TPath,
  ): Get<T, TPath> => _.get(object, path)

  const handleSortChange = (path: string, order: "asc" | "desc") => {
    const column = columns.find((c) => c.accessorPath === path)
    if (!column?.compare) {
      return
    }

    const sortedData = Array.from(tableData).sort(
      (a, b) =>
        (column?.compare?.(get(a, path), get(b, path)) ?? 0) *
        (order === "asc" ? 1 : -1),
    )
    setTableData(sortedData)
  }

  return (
    <table className={`sortable-table ${className ?? ""}`}>
      <TableHead
        columns={columns}
        defaultSort={defaultSort}
        onSortChange={handleSortChange}
        backgroundColor={backgroundColors?.head}
      />
      <TableBody
        columns={columns}
        data={tableData}
        backgroundColor={backgroundColors?.body}
      />
      <style jsx global>{`
        table {
          border-collapse: collapse;
        }
        table,
        th,
        :global(td) {
          border: black solid 1px;
        }

        thead {
          background-color: lightgray;
        }

        th,
        td {
          padding: 0 1rem;
        }
      `}</style>
    </table>
  )
}

export default Table
