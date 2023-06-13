import { Property as CSSProperty } from "csstype"
import _, { debounce } from "lodash"
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import TableBody from "./TableBody"
import TableHead from "./TableHead"

export type ColumnFilter = { id: string; value: string }

//TODO: Fix typings for column data

export type BaseColumn<TData, T = any> = {
  label?: string
  renderCell?: (value: T, item: TData) => ReactNode
  cellStyle?: React.CSSProperties
}

type SortableColumn<T> =
  | {
      sortable: true
      compare?: (a: T, b: T) => number
    }
  | {
      sortable?: false
      compare?: never
    }

type AccessorColumn<TData, T = any> = SortableColumn<T> &
  (
    | {
        accessorPath: string
        id?: never
        accessorFn?: never
      }
    | {
        accessorPath?: never
        id: string
        accessorFn?: (item: TData) => T
      }
  )

export type FilterColumn<TData, T = any> =
  | {
      enableColumnFilter: true
      filterFn: (cellValue: T, item: TData, query: string) => boolean
      defaultFilterValue?: string
      renderFilterInput?: (props: {
        filter: ColumnFilter | undefined
        setFilterValue: (value: string | null) => void
      }) => JSX.Element
    }
  | {
      enableColumnFilter?: false
      filterFn?: never
    }

export type TableColumn<TData, T = any> = BaseColumn<TData, T> &
  AccessorColumn<TData, T> &
  FilterColumn<TData, T>

type Props<TData> = {
  className?: string
  columns: TableColumn<TData>[]
  data: TData[]
  limit?: number
  offset?: number
  defaultSort?: { id: string; order: "asc" | "desc" }
  backgroundColors?: { head?: CSSProperty.Color; body?: CSSProperty.Color }
}

//TODO: Implement optional external filter management

const Table = <TData,>(props: Props<TData>) => {
  const { columns, data, defaultSort, className, backgroundColors } = props

  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>(
    columns.reduce(
      (arr, col) =>
        col?.enableColumnFilter && col?.defaultFilterValue
          ? [
              ...arr,
              {
                id: col.accessorPath ?? col.id,
                value: col.defaultFilterValue,
              },
            ]
          : arr,
      [] as ColumnFilter[],
    ),
  )

  const [currentSort, setCurrentSort] = useState<
    { id: string; order: "asc" | "desc" } | undefined
  >(defaultSort)

  const [filteredData, setFilteredData] = useState(filterData(columnFilters))

  function filterData(filters: ColumnFilter[]) {
    return filters.reduce((data, cf) => {
      const col = columns.find((c) => (c.accessorPath ?? c.id) === cf.id)

      const filterFn = col?.filterFn
      const accessorFn = col?.accessorFn ?? ((item) => _.get(item, cf.id))
      const filterValue = cf.value

      if (!filterValue || !filterFn) {
        return data
      }

      return data.filter((val) => filterFn(accessorFn(val), val, filterValue))
    }, data)
  }

  const debounceFilterDataCallback = debounce((filters: ColumnFilter[]) => {
    setFilteredData(filterData(filters))
  }, 300)

  const debounceFilterData = useCallback(debounceFilterDataCallback, [
    debounceFilterDataCallback,
  ])

  useEffect(() => {
    if (columnFilters.length === 0) {
      return
    }

    debounceFilterData(columnFilters)

    //? Cancelling debounce stops blank filter input from updating
    /* return () => {
      debounceFilterData.cancel()
    } */
  }, [columnFilters, data, debounceFilterData])

  const sortedData = useMemo(() => {
    if (!currentSort) {
      return filteredData
    }

    const { id, order } = currentSort
    const column = columns.find((c) => (c.accessorPath ?? c.id) === id)
    if (!column?.compare) {
      return filteredData
    }

    const accessorFn = column.accessorFn ?? ((item) => _.get(item, id))

    const sortedData = Array.from(filteredData).sort(
      (a, b) =>
        (column?.compare?.(accessorFn(a), accessorFn(b)) ?? 0) *
        (order === "asc" ? 1 : -1),
    )

    return sortedData
  }, [columns, currentSort, filteredData])

  return (
    <table className={className}>
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
        data={sortedData}
        backgroundColor={backgroundColors?.body}
      />
      <style jsx global>{`
        table {
          border-collapse: collapse;
        }
        table,
        th,
        :global(td) {
          border: var(--table-border);
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
