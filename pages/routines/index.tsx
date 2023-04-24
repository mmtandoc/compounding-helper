import { GetServerSideProps } from "next"
import Link from "next/link"
import useSWR from "swr"

import RoutineTable from "components/routine/RoutineTable"
import { Button } from "components/ui"
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
    },
  )

  if (error) {
    console.error(error)
  }

  if (!routines) {
    return null
  }

  const actionBar = (
    <div className="action-bar">
      <Link href="/routines/new">
        <Button>New Routine</Button>
      </Link>
      <style jsx>{`
        .action-bar {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          column-gap: 0.5rem;
        }
      `}</style>
    </div>
  )
  return (
    <div>
      {actionBar}
      <RoutineTable data={routines} />
      {actionBar}
      <style jsx>{`
        :global(.routine-table) {
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const data = await getRoutines({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  return {
    props: {
      title: "Routines",
      initialData: data,
    },
  }
}

export default Routines
