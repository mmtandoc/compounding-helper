import { Chemical } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import { BsGlobe } from "react-icons/bs"

import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { isCentralPharmacy } from "lib/utils"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll[]
}

const columnHelper = createColumnHelper<ProductAll>()

const columns = [
  columnHelper.accessor((row) => isCentralPharmacy(row.pharmacyId), {
    id: "isCentral",
    header: "",
    cell: (info) => (info.getValue() ? <BsGlobe title="Central" /> : null),
    enableColumnFilter: false,
  }),
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
    cell: function ActionsCell(info) {
      const { user, error: userError } = useCurrentUser()
      if (userError) {
        console.error(userError)
      }
      const canEdit = info.row.original.pharmacyId === user?.pharmacyId
      return (
        <DataRowActions
          row={info.row}
          viewButton={{ getUrl: (data) => `/products/${data.id}` }}
          editButton={
            canEdit
              ? { getUrl: (data) => `/products/${data.id}/edit` }
              : undefined
          }
        />
      )
    },
  }),
]

//TODO: Implement searching
const ProductTable = (props: Props) => {
  const { data } = props

  return <Table className="product-table" data={data} columns={columns} />
}

export default ProductTable
