import RiskAssessmentsRow from "./RiskAssessmentsRow"
import React from "react"
import { RiskAssessmentAll } from "types/models"

type Props = {
  data: RiskAssessmentAll[]
}

const RiskAssessmentsTable = (props: Props) => {
  const { data } = props
  const maxIngredientCount = data.reduce(
    (maxIngredients, curr) => Math.max(maxIngredients, curr.ingredients.length),
    0,
  )

  return (
    <table className="risk-assessments-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Compound name</th>
          <th colSpan={maxIngredientCount}>Ingredients</th>
        </tr>
      </thead>
      <tbody>
        {data.map((ra, i) => (
          <RiskAssessmentsRow
            data={ra}
            key={i}
            ingredientColSpan={maxIngredientCount}
          />
        ))}
      </tbody>
      <style jsx>{`
        table {
          border-collapse: collapse;
        }
        table,
        th,
        :global(td) {
          border: black solid 1px;
        }

        thead {
          background-color: lightgray;
        }

        th,
        td {
          padding: 0, 1rem;
        }
      `}</style>
    </table>
  )
}

export default RiskAssessmentsTable
