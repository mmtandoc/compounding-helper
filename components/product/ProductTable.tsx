import { Chemical } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"

import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll[]
}

const columnHelper = createColumnHelper<ProductAll>()

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    enableSorting: true,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    enableSorting: true,
    filterFn: "includesString",
  }),
  columnHelper.accessor("vendor.name", {
    header: "Vendor",
    enableSorting: true,
    filterFn: "includesString",
  }),
  columnHelper.accessor("chemical", {
    header: "Chemical",
    cell: (info) => info.getValue().name,
    sortingFn: (rowA, rowB, columnId) =>
      rowA
        .getValue<Chemical>(columnId)
        .name.localeCompare(rowB.getValue<Chemical>(columnId).name, "en-CA", {
          numeric: true,
        }),
    filterFn: (row, columnId, filterValue: string) => {
      const chemical = row.getValue<Chemical>(columnId)

      return [chemical.name, ...chemical.synonyms].some(
        (str) => str.toUpperCase() === filterValue.toUpperCase(),
      )
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => (
      <DataRowActions
        row={info.row}
        getEditUrl={(data) => `/products/${data.id}/edit`}
        getViewUrl={(data) => `/products/${data.id}`}
      />
    ),
  }),
]

//TODO: Implement searching
const ProductTable = (props: Props) => {
  const { data } = props

  return <Table className="product-table" data={data} columns={columns} />
}

export default ProductTable
