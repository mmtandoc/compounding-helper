import { subject } from "@casl/ability"
import { createColumnHelper } from "@tanstack/react-table"

import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { useAbility } from "lib/contexts/AbilityContext"
import { toIsoDateString } from "lib/utils"
import { MfrAll } from "types/models"

type Props = {
  data: MfrAll[]
  onSelectedRowsChange?: (rows: MfrAll[]) => void
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
    cell: function ActionsCell(info) {
      const ability = useAbility()

      const canEdit = ability.can("update", subject("Mfr", info.row.original))

      return (
        <DataRowActions
          row={info.row}
          viewButton={{
            getUrl: (data) =>
              `/compounds/${data.compoundId}/mfrs/${data.version}`,
          }}
          editButton={
            canEdit
              ? {
                  getUrl: (data) =>
                    `/compounds/${data.compoundId}/mfrs/${data.version}/edit`,
                }
              : undefined
          }
        />
      )
    },
  }),
]

const MfrTable = ({ data, onSelectedRowsChange }: Props) => (
  <Table
    className="mfr-table"
    data={data}
    columns={columns}
    options={{ enableRowSelection: true }}
    onSelectedRowsChange={onSelectedRowsChange}
  />
)

export default MfrTable
