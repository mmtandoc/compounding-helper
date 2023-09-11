import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { useMemo } from "react"
import { BsGlobe } from "react-icons/bs"

import { Button, Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import RowActions from "components/ui/Table/RowActions"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { isCentralPharmacy } from "lib/utils"
import { CompoundWithMfrCount, IngredientAll } from "types/models"

import { getHwngShortcutString } from "./helpers"

type Props = {
  data: CompoundWithMfrCount[]
  onSelectedRowsChange?: (rows: CompoundWithMfrCount[]) => void
  options?: { showShortcuts?: boolean }
}

const columnHelper = createColumnHelper<CompoundWithMfrCount>()

const columns = [
  columnHelper.accessor((row) => isCentralPharmacy(row.pharmacyId), {
    id: "isCentral",
    header: "",
    cell: (info) => (info.getValue() ? <BsGlobe title="Central" /> : null),
    enableColumnFilter: false,
  }),
  columnHelper.accessor("id", {
    header: "ID",
    enableColumnFilter: false,
  }),
  columnHelper.accessor(
    (row) => {
      const variations = row.shortcutVariations as {
        code: string
        name: string
      }[]

      return row.hasShortcut
        ? getHwngShortcutString(
            row.id,
            variations.length > 0
              ? [{ code: "__", name: "placeholder" }]
              : null,
            row.shortcutSuffix,
          )
        : null
    },
    {
      id: "shortcut",
      header: "HWNG Shortcut",
      enableColumnFilter: false,
      enableSorting: false,
      cell: (info) => {
        const shortcutString = info.getValue()
        if (!shortcutString) {
          return null
        }

        const data = info.row.original
        const variations = data.shortcutVariations as {
          code: string
          name: string
        }[]

        if (variations.length > 0) {
          return (
            <>
              <div>{shortcutString}</div>
              <div>{variations.map((v) => v.code).join("/")}</div>
            </>
          )
        }

        return shortcutString
      },
      meta: { cellStyle: { whiteSpace: "nowrap" } },
    },
  ),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("ingredients", {
    header: "Ingredients",
    enableSorting: false,
    cell: (info) => {
      const ingredients = info.getValue()
      return (
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
              > span {
                padding: 0 1rem;
                &:not(:last-child) {
                  border-bottom: 1px solid lightgray;
                }
              }
            }
          `}</style>
        </div>
      )
    },
    meta: { cellStyle: { padding: 0 } },
    filterFn: (row, columnId, filterValue: string) => {
      return row
        .getValue<IngredientAll[]>(columnId)
        .some((ing) =>
          [
            ing.commercialProductName,
            ing.safetyDataSheet?.product.name,
            ing.safetyDataSheet?.product.chemical.name,
            ...(ing.safetyDataSheet?.product.chemical.synonyms ?? []),
          ].some((val) =>
            val?.toUpperCase().includes(filterValue.toUpperCase()),
          ),
        )
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => (
      <DataRowActions
        row={info.row}
        viewButton={{
          getUrl: (data) => `/compounds/${data.id}`,
          value: "View compound",
        }}
        /* editButton={{ getUrl: (data) => `/compounds/${data.id}/edit` }} */
      />
    ),
    size: 1,
  }),
  columnHelper.display({
    id: "ra-actions",
    cell: (info) => (
      <RowActions>
        <Link href={`/risk-assessments/${info.row.original.id}`}>
          <Button size="small">View Risk Assessment</Button>
        </Link>
      </RowActions>
    ),
  }),
  columnHelper.display({
    id: "mfr-actions",
    cell: function MfrActionsCell(info) {
      const { user, error: userError } = useCurrentUser()
      if (userError) {
        console.error(userError)
      }

      const data = info.row.original
      const canEdit = user?.pharmacyId === data.pharmacyId

      return (
        <RowActions>
          {data._count.mfrs > 0 ? (
            <Link href={`/compounds/${data.id}/mfrs/latest`}>
              <Button size="small" theme="primary">
                View MFR
              </Button>
            </Link>
          ) : canEdit ? (
            <Link href={`/compounds/${data.id}/mfrs/new`}>
              <Button size="small">Create MFR</Button>
            </Link>
          ) : null}
        </RowActions>
      )
    },
  }),
]

const CompoundsTable = (props: Props) => {
  const {
    data,
    onSelectedRowsChange,
    options: { showShortcuts = false } = {},
  } = props

  const visibleColumns = useMemo(
    () =>
      showShortcuts ? columns : columns.filter((col) => col.id !== "shortcut"),
    [showShortcuts],
  )

  return (
    <Table
      className="compound-table"
      data={data}
      columns={visibleColumns}
      options={{ enableRowSelection: (row) => row.original._count.mfrs > 0 }}
      onSelectedRowsChange={onSelectedRowsChange}
    />
  )
}

export default CompoundsTable
