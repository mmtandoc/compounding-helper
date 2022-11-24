import Link from "next/link"

import Button from "components/common/Button"
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
    id: "actions",
    renderCell: (_, data) => (
      <div>
        <Link href={`/compounds/${data.id}`}>
          <Button size="small">View</Button>
        </Link>
        <Link href={`/compounds/${data.id}/edit`}>
          <Button size="small">Edit</Button>
        </Link>
        <Link href={`/risk-assessments/${data.id}`}>
          <Button size="small">View Risk Assessment</Button>
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
]

const CompoundsTable = (props: Props) => {
  const { data } = props
  return <Table className="compound-table" data={data} columns={columns} />
}

export default CompoundsTable
