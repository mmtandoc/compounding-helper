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

/*
.$extends({
    result: {
      routine: {
        getLastCompleted: {
          needs: { id: true },
          compute(routine) {
            return () =>
              basePrisma.routine
                .findUniqueOrThrow({
                  where: { id: routine.id },
                })
                .completionHistory({ orderBy: { date: "desc" }, take: 1 })
                .then((val) =>
                  val.length > 0 ? _.omit(val[0], "routineId") : null,
                )
          },
        },
        markCompleted: {
          needs: { id: true },
          compute(routine) {
            return (date: Date | string, employeeName: string) => {
              basePrisma.routineCompletion.create({
                data: { routineId: routine.id, date, name: employeeName },
              })
            }
          },
        },
      },
    },
  })
  .$extends({
    result: {
      routine: {
        getRRule: {
          needs: {
            startDate: true,
            getLastCompleted: true,
            recurrenceRule: true,
          },
          async compute(routine) {
            const lastCompleted = await routine.getLastCompleted()
            return new RRule({
              ...RRule.parseString(routine.recurrenceRule),
              dtstart: lastCompleted?.date ?? routine.startDate,
            })
          },
        },
      },
    },
  })
  .$extends({
    result: {
      routine: {
        nextDue: {
          needs: { startDate: true, getLastCompleted: true, getRRule: true },
          async compute(routine) {
            const lastCompleted = await routine.getLastCompleted()
            const rrule = await routine.getRRule
            return rrule.after(
              lastCompleted?.date ?? routine.startDate,
              !lastCompleted,
            ) as Date
          },
        },
      },
    },
  })
*/

const Routines: NextPageWithLayout<Props> = (props) => {
  const { initialData } = props

  const { data: routines, error } = useSWR<RoutineWithHistory[]>(
    "/api/routines",
    {
      fallbackData: initialData,
    },
  )

  if (!routines) {
    return null
  }

  if (error) {
    console.error(error)
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
  const data = await getRoutines()

  return {
    props: {
      title: "Routines",
      initialData: data,
    },
  }
}

export default Routines
