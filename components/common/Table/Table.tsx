import { Property as CSSProperty } from "csstype"
import _ from "lodash"
import React, { ReactNode, useEffect, useMemo, useState } from "react"
import { Get, Simplify } from "type-fest"

import TableBody from "./TableBody"
import TableHead from "./TableHead"

export type ColumnFilter = { id: string; value: string }

export type BaseColumn<TData, T = any> = {
  id?: string
  label?: string
  accessorPath?: string
  sortable?: boolean

  compare?: (a: T, b: T) => number
  renderCell?: (value: T, item: TData) => ReactNode
  cellStyle?: React.CSSProperties
}

export type FilterColumn<TData, T = any> = Simplify<{
  enableColumnFilter?: boolean
  filterFn?: (cellValue: T, item: TData, query: string) => boolean
}>

export type TableColumn<TData, T = any> = BaseColumn<TData, T> &
  FilterColumn<TData, T>

type Props<TData> = {
  className?: string
  columns: TableColumn<TData>[]
  data: TData[]
  limit?: number
  offset?: number
  defaultSort?: { path: string; order: "asc" | "desc" }
  backgroundColors?: { head: CSSProperty.Color; body: CSSProperty.Color }
  //onColumnFiltersChange?: (columnFilters: ColumnFilter[]) => void
  //columnFilters?: ColumnFilter[]
}

//TODO: Implement optional external filter management

const Table = <TData,>(props: Props<TData>) => {
  const {
    columns,
    data,
    defaultSort,
    className,
    backgroundColors,
    //onColumnFiltersChange,
    //columnFilters = [],
  } = props
  const [tableData, setTableData] = useState<TData[]>(data)

  const [currentSort, setCurrentSort] = useState<
    { path: string; order: "asc" | "desc" } | undefined
  >(defaultSort)

  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([])

  /* const filteredData = useMemo(() => {
    return columnFilters.reduce((data, cf) => {
      const filterFn = columns.find((c) => c.accessorPath === cf.id)?.filterFn
      return cf.value && filterFn
        ? data.filter((val) => filterFn(_.get(val, cf.id), val, cf.value))
        : data
    }, data)
  }, [columnFilters, columns, data]) */

  const filteredData = useMemo(() => {
    if (!columnFilters.length) {
      return data
    }

    return columnFilters.reduce((data, cf) => {
      const filterFn = columns.find((c) => c.accessorPath === cf.id)?.filterFn
      return cf.value && filterFn
        ? data.filter((val) => filterFn(_.get(val, cf.id), val, cf.value))
        : data
    }, data)
  }, [columnFilters, columns, data])

  const get = <T, TPath extends string>(
    object: T,
    path: TPath,
  ): Get<T, TPath> => _.get(object, path)

  useEffect(() => {
    if (defaultSort) {
      setCurrentSort(defaultSort)
    }
  }, [defaultSort])

  useEffect(() => {
    if (!currentSort) {
      setTableData(filteredData)
      return
    }

    const { path, order } = currentSort
    const column = columns.find((c) => c.accessorPath === path)
    if (!column?.compare) {
      return
    }

    const sortedData = Array.from(filteredData).sort(
      (a, b) =>
        (column?.compare?.(get(a, path), get(b, path)) ?? 0) *
        (order === "asc" ? 1 : -1),
    )

    setTableData(sortedData)
  }, [columns, currentSort, filteredData])

  return (
    <table className={`sortable-table ${className ?? ""}`}>
      <TableHead
        columns={columns}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
        onColumnFiltersChange={setColumnFilters}
        backgroundColor={backgroundColors?.head}
        columnFilters={columnFilters}
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
