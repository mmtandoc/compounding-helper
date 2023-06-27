import { createColumnHelper } from "@tanstack/react-table"

import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { toIsoDateString } from "lib/utils"
import { MfrAll } from "types/models"

type Props = {
  data: MfrAll[]
}

const columnHelper = createColumnHelper<MfrAll>()

const columns = [
  columnHelper.accessor("version", {
    header: "Version",
    enableColumnFilter: false,
  }),
  columnHelper.accessor("developedBy", {
    header: "Developed by",
    enableColumnFilter: false,
  }),
  columnHelper.accessor("verifiedBy", {
    header: "Verified by",
    enableColumnFilter: false,
    cell: (info) => info.getValue() ?? "N/A",
  }),
  columnHelper.accessor("effectiveDate", {
    header: "Effective date",
    enableColumnFilter: false,
    cell: (info) => toIsoDateString(info.getValue()),
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => (
      <DataRowActions
        row={info.row}
        getViewUrl={(data) =>
          `/compounds/${data.compoundId}/mfrs/${data.version}`
        }
        getEditUrl={(data) =>
          `/compounds/${data.compoundId}/mfrs/${data.version}/edit`
        }
      />
    ),
  }),
]

const MfrTable = (props: Props) => {
  const { data } = props

  return <Table className="mfr-table" data={data} columns={columns} />
}

export default MfrTable
