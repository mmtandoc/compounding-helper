import { RoutineCompletion } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"

import { Table } from "components/ui"
import { toIsoDateString } from "lib/utils"

type Props = {
  data: Omit<RoutineCompletion, "routineId">[]
}

const columnHelper = createColumnHelper<Omit<RoutineCompletion, "routineId">>()
const columns = [
  columnHelper.accessor("date", {
    header: "Completion Date",
    cell: (info) => toIsoDateString(info.getValue()),
  }),
  columnHelper.accessor("name", {
    header: "Completed by",
  }),
  columnHelper.accessor("comment", {
    header: "Comment",
    meta: { cellStyle: { whiteSpace: "pre-wrap" } },
  }),
]

const RoutineHistoryTable = (props: Props) => {
  const { data } = props

  return (
    <Table
      className="routine-history-table"
      data={data}
      columns={columns}
      options={{ enableFilters: false, enableSorting: false }}
    />
  )
}

export default RoutineHistoryTable
