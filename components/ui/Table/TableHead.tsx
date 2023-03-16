import { Property as CSSProperty } from "csstype"
import { useEffect, useRef, useState } from "react"
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti"

import { ColumnFilter, TableColumn } from "./Table"

type Props<TData> = {
  columns: TableColumn<TData>[]
  onSortChange: (sort: { id: string; order: "asc" | "desc" }) => void
  currentSort?: { id: string; order: "asc" | "desc" }
  backgroundColor?: CSSProperty.Color
  onColumnFiltersChange?: (columnFilters: ColumnFilter[]) => void
  columnFilters: ColumnFilter[]
}

const TableHead = <TData,>(props: Props<TData>) => {
  const {
    columns,
    onSortChange,
    backgroundColor,
    onColumnFiltersChange,
    columnFilters = [],
    currentSort,
  } = props

  const colWidthsRef = useRef<(number | undefined)[]>([])
  const [colWidths, setColWidths] = useState<(number | undefined)[]>([])

  useEffect(() => {
    setColWidths([...colWidthsRef.current])
  }, [])

  const handleSortChange = (id: string) => {
    let order: "asc" | "desc" = "asc"
    if (currentSort?.id === id) {
      order = currentSort?.order === "asc" ? "desc" : "asc"
    }
    onSortChange({ id, order })
  }

  const setFilterValue = (id: string, value: string) => {
    const newColumnFilters = [
      ...columnFilters.filter((colFilter) => colFilter.id !== id),
      { id, value },
    ]
    onColumnFiltersChange?.(newColumnFilters)
  }

  return (
    <thead>
      <tr>
        {columns.map((col, i) => {
          const { label, accessorPath, sortable, enableColumnFilter } = col
          const id = accessorPath ?? col.id
          return (
            <th
              key={i}
              ref={(el) => {
                colWidthsRef.current[i] = el?.clientWidth
              }}
              className={`head-cell ${sortable ? "sortable" : ""}`}
              style={colWidths[i] ? { width: `${colWidths[i]}px` } : undefined}
            >
              <div
                className="head-label"
                onClick={sortable ? () => handleSortChange(id) : undefined}
              >
                <span>{label ?? ""}</span>
                {sortable &&
                  (currentSort?.id === id ? (
                    currentSort?.order === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : (
                    <TiArrowUnsorted />
                  ))}
              </div>
              {enableColumnFilter && (
                <div className="filter">
                  <input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setFilterValue(id, e.target.value)}
                  />
                </div>
              )}
            </th>
          )
        })}
      </tr>
      <style jsx>{`
        thead {
          background-color: ${backgroundColor ?? "var(--color-table-head-bg)"};
        }

        th {
          padding: 0;
        }

        th > div {
          padding: 0 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          column-gap: 0.4rem;
        }

        .head-cell {
          white-space: nowrap;
        }

        .head-cell > .head-label > span {
          white-space: normal;
        }

        .head-label > :global(svg) {
          flex-shrink: 0;
        }

        .sortable {
          cursor: pointer;
        }

        .sortable:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.3);
        }

        th > .filter {
          background-color: var(--color-white);
          border-top: var(--table-border);
          padding: 0.5rem 1rem;
        }

        .filter > input {
          width: 100%;
          min-width: 5rem;
        }
      `}</style>
    </thead>
  )
}

export default TableHead
