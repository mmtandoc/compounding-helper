import { Chemical } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"

import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { toIsoDateString } from "lib/utils"
import { SdsWithRelations } from "types/models"

type Props = {
  data: SdsWithRelations[]
}

const columnHelper = createColumnHelper<SdsWithRelations>()

const columns = [
  columnHelper.accessor("id", { header: "ID", enableColumnFilter: false }),
  columnHelper.accessor("product.chemical", {
    header: "Chemical",
    filterFn: (row, columnId, filterValue: string) => {
      const chemical = row.getValue<Chemical>(columnId)
      return [chemical.name, ...chemical.synonyms].some((str) =>
        str.toUpperCase().includes(filterValue.toUpperCase()),
      )
    },
    sortingFn: (rowA, rowB, columnId) =>
      rowA
        .getValue<Chemical>(columnId)
        .name.localeCompare(rowB.getValue<Chemical>(columnId).name, undefined, {
          numeric: true,
        }),
    cell: (info) => info.getValue().name,
  }),
  columnHelper.accessor("product.name", {
    header: "Product",
    filterFn: "includesString",
  }),
  columnHelper.accessor("product.vendor.name", {
    header: "Vendor",
    filterFn: "includesString",
  }),
  columnHelper.accessor("revisionDate", {
    header: "Revision Date",
    cell: (info) => toIsoDateString(info.getValue()),
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
          viewButton={{ getUrl: (data) => `/sds/${data.id}` }}
          editButton={
            canEdit ? { getUrl: (data) => `/sds/${data.id}/edit` } : undefined
          }
        />
      )
    },
  }),
]

//TODO: add option to hide old revisions
const SdsTable = (props: Props) => {
  const { data } = props

  return <Table className="sds-table" data={data} columns={columns} />
}

export default SdsTable
