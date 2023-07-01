import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import useSWR from "swr"

import BatchDataTableActions from "components/common/BatchDataTableActions"
import { printDetails } from "components/common/styles"
import { Button, Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import RowActions from "components/ui/Table/RowActions"
import { CompoundWithMfrCount, IngredientAll, MfrAll } from "types/models"

import { getHwngShortcutString } from "./helpers"
import MfrDetails from "./mfr/MfrDetails"

type Props = {
  data: CompoundWithMfrCount[]
  options?: { showShortcuts?: boolean }
}

const columnHelper = createColumnHelper<CompoundWithMfrCount>()

const columns = [
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
        getEditUrl={(data) => `/compounds/${data.id}`}
        getViewUrl={(data) => `/compounds/${data.id}/edit`}
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
    cell: (info) => {
      const data = info.row.original
      return (
        <RowActions>
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
        </RowActions>
      )
    },
  }),
]

const CompoundsTable = (props: Props) => {
  const { data } = props
  const { showShortcuts = false } = props.options ?? {}

  const visibleColumns = useMemo(
    () =>
      showShortcuts ? columns : columns.filter((col) => col.id !== "shortcut"),
    [showShortcuts],
  )

  const [selectedRows, setSelectedRows] = useState<CompoundWithMfrCount[]>([])

  const handleSelectedRowsChange = useCallback(
    (rows: CompoundWithMfrCount[]) => setSelectedRows(rows),
    [],
  )

  const PrintDoc = ({ data }: { data: CompoundWithMfrCount }) => {
    const {
      data: mfrsData,
      error,
      isLoading,
    } = useSWR<MfrAll[]>(`/api/compounds/${data.id}/mfrs`)

    if (error) {
      console.error(error)
    }

    const mfrData = useMemo(
      () =>
        mfrsData?.reduce((prev, curr) =>
          prev.version > curr.version ? prev : curr,
        ),
      [mfrsData],
    )

    if (isLoading || mfrsData === undefined || mfrData === undefined) {
      return <p>Loading...</p>
    }

    return (
      <div className="details">
        <h1>
          MFR: {mfrData.compound.name} - v.{mfrData.version}
        </h1>
        <MfrDetails data={mfrData} />
        <style jsx>{printDetails}</style>
      </div>
    )
  }

  const renderDocument = (data: CompoundWithMfrCount) => {
    return <PrintDoc data={data} />
  }

  return (
    <>
      <BatchDataTableActions
        selectedRows={selectedRows}
        renderDocument={renderDocument}
        printButtonText="Print selected MFRs"
      />
      <Table
        className="compound-table"
        data={data}
        columns={visibleColumns}
        options={{ enableRowSelection: (row) => row.original._count.mfrs > 0 }}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
      <BatchDataTableActions
        selectedRows={selectedRows}
        renderDocument={renderDocument}
        printButtonText="Print selected MFRs"
      />
    </>
  )
}

export default CompoundsTable
