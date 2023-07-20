import {
  Column,
  ColumnDef,
  RowData,
  RowSelectionState,
  TableOptions,
  Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti"

import { IndeterminateCheckbox } from "../forms"
import { Filter } from "./Filter"

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterComponent?: (info: {
      column: Column<TData, TValue>
      table: TanstackTable<TData>
    }) => JSX.Element
    cellStyle?: React.CSSProperties
    headerStyle?: React.CSSProperties
  }
}

type TableProps<TData> = {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  options?: Partial<TableOptions<TData>> & { enableFooter?: boolean }
  onSelectedRowsChange?: (rows: TData[]) => void
  className?: string
}

const Table = <TData,>(props: TableProps<TData>) => {
  const {
    columns,
    data,
    options: { enableFooter = false, ...tableOptions } = {},
    onSelectedRowsChange,
    className,
  } = props
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // If enableRowSelection is row, automatically add select column
  const columnsMemo = useMemo(
    () =>
      tableOptions?.enableRowSelection
        ? [
            {
              id: "select",
              header: ({ table }) => (
                <IndeterminateCheckbox
                  checked={table.getIsAllRowsSelected()}
                  indeterminate={table.getIsSomeRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />
              ),
              cell: ({ row }) => (
                <IndeterminateCheckbox
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  indeterminate={row.getIsSomeSelected()}
                  onChange={row.getToggleSelectedHandler()}
                />
              ),
              footer: ({ table }) => (
                <IndeterminateCheckbox
                  checked={table.getIsAllRowsSelected()}
                  indeterminate={table.getIsSomeRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />
              ),
            },
            ...columns,
          ]
        : columns,
    [columns, tableOptions?.enableRowSelection],
  )

  const table = useReactTable({
    data,
    columns: columnsMemo,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedRowModel: getFacetedRowModel(),
    enableColumnResizing: false,
    columnResizeMode: "onChange",
    ...tableOptions,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  })

  useEffect(() => {
    onSelectedRowsChange?.(
      table.getSelectedRowModel().flatRows.map((row) => row.original),
    )
  }, [rowSelection, table, onSelectedRowsChange])

  const colWidthsRef = useRef<Map<string, number | undefined>>(
    new Map<string, number | undefined>(),
  )
  const [colWidths, setColWidths] = useState<Map<
    string,
    number | undefined
  > | null>(new Map<string, number | undefined>())

  useLayoutEffect(() => {
    setColWidths(null)
  }, [columns])

  const hasFooter = useMemo(
    () =>
      table
        .getFooterGroups()
        .some((fgroup) =>
          fgroup.headers.some(
            (h) => h.column.columnDef.footer || h.column.getCanFilter(),
          ),
        ),
    [table],
  )

  return (
    <table className={className}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                ref={(el) => {
                  if (el?.offsetWidth === undefined) return

                  colWidthsRef.current.set(header.column.id, el.offsetWidth)
                  if (!colWidths) {
                    setColWidths(colWidthsRef.current)
                  }
                }}
                colSpan={header.colSpan}
                style={{
                  ...header.column.columnDef.meta?.headerStyle,
                  // Don't overwrite headerStyle width if not in colWidth
                  ...(colWidths?.has(header.column.id)
                    ? { width: `${colWidths.get(header.column.id)}px` }
                    : undefined),
                }}
              >
                {header.isPlaceholder ? null : (
                  <>
                    <div
                      {...{
                        className: `header ${
                          header.column.getCanSort() ? "sortable" : ""
                        }`,
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort()
                        ? {
                            asc: <TiArrowSortedUp />,
                            desc: <TiArrowSortedDown />,
                          }[header.column.getIsSorted() as string] ?? (
                            <TiArrowUnsorted />
                          )
                        : null}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div className="filter">
                        {header.column.columnDef?.meta &&
                        header.column.columnDef.meta.filterComponent ? (
                          header.column.columnDef.meta.filterComponent({
                            column: header.column,
                            table,
                          })
                        ) : (
                          <Filter column={header.column} table={table} />
                        )}
                      </div>
                    ) : null}
                    {header.getSize() !== 0 && header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                      />
                    )}
                  </>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} style={cell.column.columnDef.meta?.cellStyle}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {enableFooter && hasFooter && (
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                  {header.column.getCanFilter() ? (
                    <div className="filter">
                      {header.column.columnDef?.meta &&
                      header.column.columnDef.meta.filterComponent ? (
                        header.column.columnDef.meta.filterComponent({
                          column: header.column,
                          table,
                        })
                      ) : (
                        <Filter column={header.column} table={table} />
                      )}
                    </div>
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      )}
      <style jsx global>{`
        // https://stackoverflow.com/questions/33168178/why-does-firefox-not-render-border-of-table-with-empty-tbody
        table {
          border-collapse: separate; /*changed from collapse*/
          border-spacing: 0;
          border: var(--table-border);
          border-width: 0 0 1px 1px; /*draw bottom and left borders*/
        }

        th,
        td {
          border: var(--table-border);
          border-width: 1px 1px 0 0; /*draw top and right borders*/
        }

        td {
          padding: 0 1rem;
        }

        th {
          padding: 0;
        }

        thead {
          background-color: var(--color-table-head-bg);

          th {
            position: relative;
            > .header {
              padding: 0 1rem;
              display: flex;
              justify-content: center;
              align-items: center;
              column-gap: 0.4rem;
            }
          }

          .head-cell {
            white-space: nowrap;
            > .head-label > span {
              white-space: normal;
            }
          }

          .head-cell .head-label > :global(svg) {
            flex-shrink: 0;
          }

          .sortable {
            cursor: pointer;
            &:hover {
              box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.3);
            }
          }
        }

        th > .filter {
          background-color: var(--color-scale-gray-100);
          border-top: var(--table-border);
          padding: 0.5rem 1rem;

          input {
            width: 100%;
            min-width: 4rem;
          }
        }

        .resizer {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 5px;
          background: rgba(0, 0, 0, 0.5);
          cursor: col-resize;
          user-select: none;
          touch-action: none;

          &.isResizing {
            background: blue;
            opacity: 1;
          }
        }

        @media (hover: hover) {
          .resizer {
            opacity: 0;
          }

          *:hover > .resizer {
            opacity: 1;
          }
        }
      `}</style>
    </table>
  )
}

export default Table
