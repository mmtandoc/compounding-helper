import { HazardCategory } from "@prisma/client"
import React from "react"

import { HazardClassesWithCategories } from "types/models"

type HazardsTableProps = {
  data: HazardClassesWithCategories[]
}

const HazardsTable = (props: HazardsTableProps) => {
  const { data } = props

  const renderHazardCategoryCells = (
    hazardCategory: HazardCategory,
    className?: string,
  ) => (
    <>
      <th scope="row" className={`category ${className ?? ""}`}>
        {hazardCategory.level}
        {hazardCategory.shortDescription
          ? ` - ${hazardCategory.shortDescription}`
          : ""}
      </th>
      <td className={`category-description ${className ?? ""}`}>
        {hazardCategory.description}
      </td>
    </>
  )

  const renderHazardClassRow = (hazardClass: HazardClassesWithCategories) => {
    const catCount = hazardClass.hazardCategories.reduce(
      (count, cat) => count + cat.subcategories.length + 1,
      0,
    )
    return hazardClass.hazardCategories
      .sort((a, b) => a.level.localeCompare(b.level))
      .map((cat, i) => (
        <React.Fragment key={cat.id}>
          <tr>
            {i === 0 && (
              <>
                <th rowSpan={catCount} scope="rowgroup" className="class-name">
                  {hazardClass.name}
                </th>
                <td rowSpan={catCount} className="class-description">
                  {hazardClass.description}
                </td>
              </>
            )}
            {renderHazardCategoryCells(cat)}
          </tr>
          {cat.subcategories
            .sort((a, b) => a.level.localeCompare(b.level))
            .map((subcat) => (
              <tr key={`${subcat.id}`}>
                {renderHazardCategoryCells(subcat, "subcategory")}
              </tr>
            ))}
        </React.Fragment>
      ))
  }

  return (
    <table className="hazards-table">
      <thead>
        <tr>
          <th>Class</th>
          <th>Class Description</th>
          <th>Category</th>
          <th>Category Description</th>
        </tr>
      </thead>
      <tbody>{data.map(renderHazardClassRow)}</tbody>
      <style global jsx>{`
        .hazards-table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background-color: var(--color-table-head-bg);
        }

        tbody {
          background-color: var(--color-canvas-subtle);
        }

        td,
        th {
          padding: 0.3rem 1rem;
        }

        table,
        td,
        th {
          border: var(--table-border);
        }

        th.category {
          text-align: left;
          white-space: nowrap;
        }

        .class-description,
        .category-description {
          font-size: 1.4rem;
        }

        th.class-name {
          background-color: var(--color-scale-gray-150);
        }

        .category {
          background-color: var(--color-canvas-subtle);
        }

        .subcategory {
          padding-left: 2rem;
          background-color: var(--color-canvas-default);
        }
      `}</style>
    </table>
  )
}

export default HazardsTable
