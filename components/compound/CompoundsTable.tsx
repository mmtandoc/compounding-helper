import Link from "next/link"

import Table from "components/common/Table"
import { TableColumn } from "components/common/Table/Table"
import filterFns from "lib/table/filterFns"
import { CompoundWithIngredients, IngredientAll } from "types/models"

type Props = {
  data: CompoundWithIngredients[]
}

const columns: TableColumn<CompoundWithIngredients, any>[] = [
  {
    label: "ID",
    sortable: true,
    compare: (a: number, b: number) => a - b,
    accessorPath: "id",
    cellStyle: { width: "3em" },
  },
  {
    label: "Name",
    sortable: true,
    compare: (a: string, b: string) => a.localeCompare(b),
    accessorPath: "name",
    enableColumnFilter: true,
    filterFn: filterFns.string,
    cellStyle: { width: "30%" },
  },
  {
    label: "Ingredients",
    accessorPath: "ingredients",
    cellStyle: { padding: 0, width: "30%" },
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
    enableColumnFilter: true,
    filterFn: filterFns.ingredients,
  },
  {
    label: "Has MFR",
    sortable: true,
    compare: (a: boolean, b: boolean) => Number(a) - Number(b),
    renderCell: (value) => <>{value ? "Yes" : "No"}</>,
    accessorPath: "hasMasterFormulationRecord",
  },
  {
    label: "Beyond Use Date",
    sortable: true,
    compare: (a: string | null | undefined, b: string | null | undefined) =>
      (a ?? "N/A").localeCompare(b ?? "N/A"),
    renderCell: (value) => <>{value ?? "N/A"}</>,
    accessorPath: "beyondUseDate",
  },
  {
    id: "view",
    renderCell: (_, data) => (
      <>
        <Link href={`/compounds/${data.id}`} passHref>
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
  {
    id: "edit",
    renderCell: (_, data) => (
      <>
        <Link href={`/compounds/${data.id}/edit`} passHref>
          <button type="button">Edit</button>
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
  {
    id: "viewRiskAssessment",
    renderCell: (_, data) => (
      <>
        <Link href={`/risk-assessments/${data.id}`} passHref>
          <button type="button">View Risk Assessment</button>
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
]

const CompoundsTable = (props: Props) => {
  const { data } = props
  return <Table className="compound-table" data={data} columns={columns} />
}

export default CompoundsTable
