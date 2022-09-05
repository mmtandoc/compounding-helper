import Link from "next/link"
import React from "react"
import { RiskAssessmentAll } from "types/models"

type RiskAssessmentsRowProps = {
  data: RiskAssessmentAll
}

const RiskAssessmentsRow = (props: RiskAssessmentsRowProps) => {
  const { data } = props
  return (
    <tr>
      <td>{data.id}</td>
      <td>
        <Link href={`/risk-assessments/${data.id}`}>
          <a>{data.compoundName}</a>
        </Link>
      </td>
      {data.ingredients.map((ingredient, i) => {
        const chemical = ingredient?.safetyDataSheet?.product.chemical
        if (!chemical) {
          return <td key={i}>{ingredient.commercialProductName}</td>
        }
        const chemicalLink = (
          <Link href={`/chemicals/${chemical.id}`}>
            <a>{chemical.name}</a>
          </Link>
        )
        return (
          <td key={i}>
            {ingredient.commercialProductName ? (
              <>
                {ingredient.commercialProductName} ({chemicalLink})
              </>
            ) : (
              chemicalLink
            )}
          </td>
        )
      })}
    </tr>
  )
}

export default RiskAssessmentsRow
