import Link from "next/link"
import { useCallback, useState } from "react"
import useSWR from "swr"

import { BatchPrintButton } from "components/common/BatchPrintButton"
import BatchTableActions from "components/common/BatchTableActions"
import { printDetails } from "components/common/styles"
import TableActionBar from "components/common/TableActionBar"
import RoutineDetails from "components/routine/RoutineDetails"
import RoutineTable from "components/routine/RoutineTable"
import { Button } from "components/ui"
import { withPageAuth } from "lib/auth"
import { Can } from "lib/contexts/AbilityContext"
import { RoutineEntity } from "lib/entities"
import { getRoutines } from "pages/api/routines"
import { NextPageWithLayout } from "types/common"
import { RoutineWithHistory } from "types/models"

type Props = {
  initialData: RoutineWithHistory[]
}

const Routines: NextPageWithLayout<Props> = (props) => {
  const { initialData } = props

  const { data: routines, error } = useSWR<RoutineWithHistory[]>(
    "/api/routines?sort=category:asc,name:asc",
    {
      fallbackData: initialData,
      revalidateOnMount: true,
    },
  )

  const [selectedRows, setSelectedRows] = useState<RoutineEntity[]>([])

  const handleSelectedRowsChange = useCallback(
    (rows: RoutineEntity[]) => setSelectedRows(rows),
    [],
  )

  if (error) {
    console.error(error)
  }

  if (!routines) {
    return null
  }

  const actionBar = (
    <TableActionBar>
      <Can do="create" on="Routine">
        <Link href="/routines/new">
          <Button>New Routine</Button>
        </Link>
      </Can>
      <BatchTableActions visible={selectedRows.length > 0}>
        <BatchPrintButton documents={selectedRows.map(renderDocument)}>
          Print selected routines
        </BatchPrintButton>
      </BatchTableActions>
    </TableActionBar>
  )

  return (
    <div>
      {actionBar}
      <RoutineTable
        data={routines}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
      {actionBar}
      <style jsx>{`
        :global(.routine-table) {
          width: 100%;
        }
      `}</style>
    </div>
  )
}

const renderDocument = (data: RoutineEntity) => (
  <div className="details">
    <h1>Routine: {data.name}</h1>
    <RoutineDetails data={data} />
    <style jsx>{printDetails}</style>
  </div>
)

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const data = await getRoutines(session, {
      orderBy: [{ category: "asc" }, { name: "asc" }],
    })

    return {
      props: {
        title: "Routines",
        initialData: data,
      },
    }
  },
  requireAuth: true,
})

export default Routines
