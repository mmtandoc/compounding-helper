import { Chemical } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"

import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { toIsoDateString } from "lib/utils"

type Props = {
  data: Chemical[]
}

const columnHelper = createColumnHelper<Chemical>()

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    filterFn: "equalsString",
  }),
  columnHelper.accessor("name", {
    header: "Name",
    filterFn: "includesString",
  }),
  columnHelper.accessor("casNumber", {
    header: "CAS #",
  }),
  columnHelper.accessor("nioshTable", {
    header: "NIOSH Table",
    cell: (info) =>
      info.getValue() === -1 ? "N/A" : `Table ${info.getValue()}`,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("nioshRevisionDate", {
    header: "NIOSH Revision Date",
    cell: (info) => {
      const value = info.getValue()
      return value ? toIsoDateString(value) : ""
    },
    enableColumnFilter: false,
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => (
      <DataRowActions
        row={info.row}
        viewButton={{ getUrl: (data) => `/chemicals/${data.id}` }}
        editButton={{ getUrl: (data) => `/chemicals/${data.id}/edit` }}
      />
    ),
  }),
]

const ChemicalTable = (props: Props) => {
  const { data } = props

  return <Table className="chemical-table" data={data} columns={columns} />
}

export default ChemicalTable
