import { Property as CSSProperty } from "csstype"
import { useEffect, useState } from "react"
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti"
import { TableColumn } from "./Table"

type Props<TData> = {
  columns: TableColumn<TData>[]
  onSortChange: (path: string, order: "asc" | "desc") => void
  defaultSort?: { path: string; order: "asc" | "desc" }
  backgroundColor?: CSSProperty.Color
}

const TableHead = <TData,>(props: Props<TData>) => {
  const {
    columns,
    onSortChange,
    defaultSort,
    backgroundColor = "lightgray",
  } = props
  const [sortPath, setSortPath] = useState<string | undefined>(
    defaultSort?.path,
  )
  const [order, setOrder] = useState<"asc" | "desc">(
    defaultSort?.order ?? "asc",
  )

  useEffect(() => {
    if (defaultSort) {
      onSortChange(defaultSort.path, defaultSort.order)
    }
  }, [defaultSort, onSortChange])

  const handleSortChange = (path: string) => {
    if (sortPath === path) {
      setOrder(order === "asc" ? "desc" : "asc")
      onSortChange(path, order === "asc" ? "desc" : "asc")
      return
    }
    setSortPath(path)
    setOrder("asc")
    onSortChange(path, "asc")
  }

  return (
    <thead>
      <tr>
        {columns.map(({ label, accessorPath, sortable }) => (
          <th
            key={accessorPath}
            className={sortable ? "sortable" : ""}
            onClick={
              sortable && accessorPath
                ? () => handleSortChange(accessorPath)
                : undefined
            }
          >
            <span>
              {label}
              {sortable &&
                (sortPath === accessorPath ? (
                  order === "asc" ? (
                    <TiArrowSortedUp />
                  ) : (
                    <TiArrowSortedDown />
                  )
                ) : (
                  <TiArrowUnsorted />
                ))}
            </span>
          </th>
        ))}
      </tr>
      <style jsx>{`
        th {
          background-color: ${backgroundColor};
        }

        th > span {
          display: flex;
          align-items: center;
        }

        th.sortable {
          cursor: pointer;
        }

        th.sortable:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </thead>
  )
}

export default TableHead
