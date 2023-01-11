import Link from "next/link"

import { Button, Table } from "components/ui"
import filterFns from "lib/table/filterFns"
import { IngredientAll, RiskAssessmentAll } from "types/models"

type Props = {
  data: RiskAssessmentAll[]
}

const RiskAssessmentsTable = (props: Props) => {
  const { data } = props

  return (
    <Table
      className="risk-assessment-table"
      data={data}
      columns={[
        {
          label: "ID",
          sortable: true,
          compare: (a: number, b: number) => a - b,
          accessorPath: "id",
        },
        {
          label: "Compound name",
          sortable: true,
          compare: (a: string, b: string) => a.localeCompare(b),
          accessorPath: "compound.name",
          enableColumnFilter: true,
          filterFn: filterFns.string,
        },
        {
          label: "Ingredients",
          accessorPath: "compound.ingredients",
          cellStyle: { padding: 0 },
          renderCell: (ingredients: IngredientAll[]) => (
            <div>
              {ingredients.map((ingredient, i) => {
                const chemical = ingredient?.safetyDataSheet?.product.chemical
                if (!chemical) {
                  return <span key={i}>{ingredient.commercialProductName}</span>
                }
                const chemicalLink = (
                  <Link href={`/chemicals/${chemical.id}`}>
                    {chemical.name}
                  </Link>
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
              <Link href={`/risk-assessments/${data.id}`}>
                <Button size="small" theme="primary">
                  View
                </Button>
              </Link>
              <Link href={`/risk-assessments/${data.id}/edit`}>
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
      ]}
    />
  )
}

export default RiskAssessmentsTable
