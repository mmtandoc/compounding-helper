import { Column, Table } from "@tanstack/react-table"
import React from "react"

import { DebouncedInput } from "../forms"

export const Filter = <TData, TValue>({
  column,
  table,
}: {
  column: Column<TData, TValue>
  table: Table<TData>
}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue<TValue>(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort() as TValue[],
    [column.getFacetedUniqueValues()],
  )

  return (
    <>
      {["number", "string"].includes(typeof firstValue) && (
        <datalist id={column.id + "list"}>
          {sortedUniqueValues.slice(0, 5000).map((value, i) => (
            <option value={value as any} key={`${i}-${value}`} />
          ))}
        </datalist>
      )}
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={
          ["number", "string"].includes(typeof firstValue)
            ? `Search... (${column.getFacetedUniqueValues().size})`
            : "Search..."
        }
        list={column.id + "list"}
      />
    </>
  )
}
