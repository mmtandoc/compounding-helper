import { subject } from "@casl/ability"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { BsGlobe } from "react-icons/bs"

import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { useAbility } from "lib/contexts/AbilityContext"
import { isCentralPharmacy } from "lib/utils"
import { IngredientAll, RiskAssessmentAll } from "types/models"

type Props = {
  data: RiskAssessmentAll[]
  onSelectedRowsChange?: (rows: RiskAssessmentAll[]) => void
}

const columnHelper = createColumnHelper<RiskAssessmentAll>()

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
    cell: function ActionsCell(info) {
      const ability = useAbility()

      const canEdit = ability.can(
        "update",
        subject("RiskAssessment", info.row.original),
      )
      return (
        <DataRowActions
          row={info.row}
          viewButton={{ getUrl: (data) => `/risk-assessments/${data.id}` }}
          editButton={
            canEdit
              ? { getUrl: (data) => `/risk-assessments/${data.id}/edit` }
              : undefined
          }
        />
      )
    },
  }),
]

const RiskAssessmentsTable = ({ data, onSelectedRowsChange }: Props) => (
  <Table
    className="risk-assessment-table"
    data={data}
    columns={columns}
    options={{ enableRowSelection: true }}
    onSelectedRowsChange={onSelectedRowsChange}
  />
)

export default RiskAssessmentsTable
