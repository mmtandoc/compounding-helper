import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { useCallback, useState } from "react"

import { BatchPrintButton } from "components/common/BatchPrintButton"
import BatchTableActions from "components/common/BatchTableActions"
import { printDetails } from "components/common/styles"
import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { toIsoDateString } from "lib/utils"
import { IngredientAll, RiskAssessmentAll } from "types/models"

import RiskAssessmentDetails from "./RiskAssessmentDetails"

type Props = {
  data: RiskAssessmentAll[]
}

const columnHelper = createColumnHelper<RiskAssessmentAll>()

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    enableColumnFilter: false,
    size: 100,
  }),
  columnHelper.accessor("compound.name", {
    header: "Compound name",
  }),
  columnHelper.accessor("compound.ingredients", {
    header: "Ingredients",
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
            }
            div > span {
              padding: 0 1rem;
            }

            div > span:not(:last-child) {
              border-bottom: 1px solid lightgray;
            }
          `}</style>
        </div>
      )
    },
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
        getViewUrl={(data) => `/risk-assessments/${data.id}`}
        getEditUrl={(data) => `/risk-assessments/${data.id}/edit`}
      />
    ),
  }),
]

const RiskAssessmentsTable = (props: Props) => {
  const { data } = props

  const [selectedRows, setSelectedRows] = useState<RiskAssessmentAll[]>([])

  const handleSelectedRowsChange = useCallback(
    (rows: RiskAssessmentAll[]) => setSelectedRows(rows),
    [],
  )

  const renderDocument = (data: RiskAssessmentAll) => (
    <div className="details">
      <h1>
        Risk Assessment: {data.compound.name} (
        {toIsoDateString(data.dateAssessed)})
      </h1>
      <RiskAssessmentDetails data={data} />
      <style jsx>{printDetails}</style>
    </div>
  )

  return (
    <>
      <BatchTableActions selectedRows={selectedRows}>
        <BatchPrintButton documents={selectedRows.map(renderDocument)}>
          Print selected rows
        </BatchPrintButton>
      </BatchTableActions>
      <Table
        className="risk-assessment-table"
        data={data}
        columns={columns}
        options={{ enableRowSelection: true }}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
      <BatchTableActions selectedRows={selectedRows}>
        <BatchPrintButton documents={selectedRows.map(renderDocument)}>
          Print selected rows
        </BatchPrintButton>
      </BatchTableActions>
    </>
  )
}

export default RiskAssessmentsTable
