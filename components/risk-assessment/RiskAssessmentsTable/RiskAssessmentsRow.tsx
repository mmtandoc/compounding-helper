import _ from "lodash"
import Link from "next/link"
import React from "react"
import { RiskAssessmentAll } from "types/models"

type RiskAssessmentsRowProps = {
  data: RiskAssessmentAll
  ingredientColSpan: number
}

const RiskAssessmentsRow = (props: RiskAssessmentsRowProps) => {
  const { data, ingredientColSpan } = props
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
      {_.range(ingredientColSpan - data.ingredients.length).map((i) => (
        <td key={i}></td>
      ))}
      <style jsx>{`
        th,
        td {
          padding: 0 1rem;
        }
      `}</style>
    </tr>
  )
}

export default RiskAssessmentsRow
