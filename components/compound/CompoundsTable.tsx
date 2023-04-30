import Link from "next/link"
import { useMemo } from "react"

import { Button, Table } from "components/ui"
import { TableColumn } from "components/ui/Table"
import filterFns from "lib/table/filterFns"
import { CompoundWithMfrCount, IngredientAll } from "types/models"

import { getHwngShortcutString } from "./helpers"

type Props = {
  data: CompoundWithMfrCount[]
  options?: { showShortcuts?: boolean }
}

const columns: TableColumn<CompoundWithMfrCount, any>[] = [
  {
    label: "ID",
    sortable: true,
    compare: (a: number, b: number) => a - b,
    accessorPath: "id",
    cellStyle: { width: "3em" },
  },
  {
    id: "shortcut",
    label: "HWNG Shortcut",
    renderCell: (_, data) => {
      const variations = data.shortcutVariations as {
        code: string
        name: string
      }[]
      if (!data.hasShortcut) return ""

      if (variations.length > 0) {
        return (
          <>
            <div>
              {getHwngShortcutString(
                data.id,
                [{ code: "__", name: "placeholder" }],
                data.shortcutSuffix,
              )}
            </div>
            <div>{variations.map((v) => v.code).join("/")}</div>
          </>
        )
      } else {
        return getHwngShortcutString(data.id, variations, data.shortcutSuffix)
      }
    },
    cellStyle: { whiteSpace: "nowrap" },
  },
  {
    label: "Name",
    sortable: true,
    compare: (a: string, b: string) => a.localeCompare(b),
    accessorPath: "name",
    enableColumnFilter: true,
    filterFn: filterFns.string,
    cellStyle: { width: "30%" },
  },
  {
    label: "Ingredients",
    accessorPath: "ingredients",
    cellStyle: { padding: 0, width: "30%" },
    renderCell: (ingredients: IngredientAll[]) => (
      <div>
        {ingredients.map((ingredient, i) => {
          const chemical = ingredient?.safetyDataSheet?.product.chemical
          if (!chemical) {
            return <span key={i}>{ingredient.commercialProductName}</span>
          }
          const chemicalLink = (
            <Link href={`/chemicals/${chemical.id}`}>{chemical.name}</Link>
          )
          return (
            <span key={i}>
              {ingredient.commercialProductName ? (
                <>
                  {ingredient.commercialProductName} ({chemicalLink})
                </>
              ) : (
                chemicalLink
              )}
            </span>
          )
        })}
        <style jsx>{`
          div {
            display: flex;
            flex-direction: column;
          }
          div > span {
            padding: 0 1rem;
          }

          div > span:not(:last-child) {
            border-bottom: 1px solid lightgray;
          }
        `}</style>
      </div>
    ),
    enableColumnFilter: true,
    filterFn: filterFns.ingredients,
  },
  {
    id: "actions",
    renderCell: (_, data) => (
      <div>
        <Link href={`/compounds/${data.id}`}>
          <Button size="small" theme="primary">
            View
          </Button>
        </Link>
        <Link href={`/compounds/${data.id}/edit`}>
          <Button size="small">Edit</Button>
        </Link>
        <style jsx>{`
          div {
            display: flex;
            column-gap: 0.3rem;
            flex-wrap: nowrap;
            margin: 0.2rem 0;
          }
        `}</style>
      </div>
    ),
  },
  {
    id: "ra-actions",
    renderCell: (_, data) => (
      <div>
        <Link href={`/risk-assessments/${data.id}`}>
          <Button size="small">View Risk Assessment</Button>
        </Link>
        <style jsx>{`
          div {
            display: flex;
            column-gap: 0.3rem;
            flex-wrap: nowrap;
            margin: 0.2rem 0;
          }
        `}</style>
      </div>
    ),
  },
  {
    id: "mfr-actions",
    renderCell: (_, data) => (
      <div>
        {data._count.mfrs > 0 ? (
          <Link href={`/compounds/${data.id}/mfrs/latest`}>
            <Button size="small" theme="primary">
              View MFR
            </Button>
          </Link>
        ) : (
          <Link href={`/compounds/${data.id}/mfrs/new`}>
            <Button size="small">Create MFR</Button>
          </Link>
        )}
        <style jsx>{`
          div {
            display: flex;
            column-gap: 0.3rem;
            flex-wrap: nowrap;
            margin: 0.2rem 0;
          }
        `}</style>
      </div>
    ),
  },
]

const CompoundsTable = (props: Props) => {
  const { data } = props
  const { showShortcuts = false } = props.options ?? {}

  const visibleColumns = useMemo(
    () =>
      showShortcuts ? columns : columns.filter((col) => col.id !== "shortcut"),
    [showShortcuts],
  )

  return (
    <Table className="compound-table" data={data} columns={visibleColumns} />
  )
}

export default CompoundsTable
