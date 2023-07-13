import { createColumnHelper } from "@tanstack/react-table"

import { Table } from "components/ui"
import type { Quantity } from "lib/fields"
import { CompoundWithIngredients, IngredientAll } from "types/models"

type IngredientWithQuantity = IngredientAll & { quantity: Quantity }

type FormulaDetailsTableProps = {
  compound: CompoundWithIngredients
  quantities: Quantity[]
}

const columnHelper = createColumnHelper<IngredientWithQuantity>()

const columns = [
  columnHelper.accessor(
    (row) =>
      row.commercialProductName
        ? row.commercialProductName
        : `${row?.safetyDataSheet?.product.name} (${row?.safetyDataSheet?.product.vendor.name})`,
    {
      header: "Name",
    },
  ),
  columnHelper.accessor("safetyDataSheet.product.chemical.name", {
    header: "Chemical",
  }),
  columnHelper.accessor(
    (row) =>
      row.commercialProductDin
        ? `DIN: ${row.commercialProductDin}`
        : `CAS #: ${row?.safetyDataSheet?.product.chemical.casNumber ?? "N/A"}`,
    { header: "Unique ID" },
  ),
  columnHelper.accessor("physicalForm", { header: "Form" }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (info) =>
      `${info.getValue().amount.toFixed(2)} ${info.getValue().unit}`,
    meta: { cellStyle: { textAlign: "right" } },
  }),
]

export const FormulaDetailsTable = (props: FormulaDetailsTableProps) => {
  const { compound, quantities } = props

  const ingredientsWithQuantity = compound.ingredients.map((ing, i) => ({
    ...ing,
    quantity: quantities[i],
  }))

  return (
    <Table
      className="ingredients-table"
      data={ingredientsWithQuantity}
      columns={columns}
      options={{ enableFilters: false, enableSorting: false }}
    />
  )
}
