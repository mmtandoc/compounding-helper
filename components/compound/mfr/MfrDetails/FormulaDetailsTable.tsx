import { Table } from "components/ui"
import type { Quantity } from "lib/fields"
import { CompoundWithIngredients } from "types/models"

type FormulaDetailsTableProps = {
  compound: CompoundWithIngredients
  quantities: Quantity[]
}

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
      columns={[
        {
          label: "Name",
          id: "name",
          renderCell: (_, data) =>
            data.commercialProductName
              ? data.commercialProductName
              : `${data?.safetyDataSheet?.product.name} (${data?.safetyDataSheet?.product.vendor.name})`,
        },
        {
          label: "Chemical",
          accessorPath: "safetyDataSheet.product.chemical.name",
        },
        {
          label: "Unique ID",
          id: "unique-id",
          renderCell: (_, data) =>
            data.commercialProductDin
              ? `DIN: ${data.commercialProductDin}`
              : `CAS #: ${
                  data?.safetyDataSheet?.product.chemical.casNumber ?? "N/A"
                }`,
        },
        {
          label: "Form",
          accessorPath: "physicalForm",
        },
        {
          label: "Quantity",
          accessorPath: "quantity",
          cellStyle: {
            textAlign: "center",
          },
          renderCell: (quantity: Quantity) =>
            `${quantity.amount.toFixed(2)} ${quantity.unit}`,
        },
      ]}
    />
  )
}
