import { RoutineCompletion } from "@prisma/client"

import { Table } from "components/ui"
import { toIsoDateString } from "lib/utils"

type Props = {
  data: Omit<RoutineCompletion, "routineId">[]
}

const RoutineHistoryTable = (props: Props) => {
  const { data } = props

  return (
    <Table
      className="routine-history-table"
      data={data}
      columns={[
        {
          accessorPath: "date",
          label: "Completion Date",
          renderCell: (date: Date) => toIsoDateString(date),
        },
        {
          accessorPath: "name",
          label: "Completed by",
        },
        {
          accessorPath: "comment",
          label: "Comment",
          cellStyle: { whiteSpace: "pre-wrap" },
        },
      ]}
    />
  )
}

export default RoutineHistoryTable
