import Table from "components/common/Table"
import Link from "next/link"
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
          accessorPath: "compoundName",
        },
        {
          label: "Ingredients",
          accessorPath: "ingredients",
          sortable: false,
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
                    <a>{chemical.name}</a>
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
        },
        {
          label: "",
          sortable: false,
          renderCell: (_, data) => (
            <>
              <Link href={`/risk-assessments/${data.id}`} passHref>
                <button type="button">View</button>
              </Link>
              <style jsx>{`
                td > button {
                  display: block;
                  margin: auto;
                }
              `}</style>
            </>
          ),
        },
      ]}
    />
  )
}

export default RiskAssessmentsTable
