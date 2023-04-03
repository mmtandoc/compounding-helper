import { useMemo } from "react"
import { RRule, rrulestr } from "rrule"

import { FormGroup, TextArea } from "components/ui/forms"
import { toIsoDateString } from "lib/utils"
import { RoutineWithHistory } from "types/models"

import RoutineHistoryTable from "./RoutineHistoryTable"

type Props = {
  data: RoutineWithHistory
}

const RoutineDetails = (props: Props) => {
  //TODO: Implement editable SDS component
  const { data } = props

  const { rrule, lastCompleted } = useMemo(
    () => ({
      lastCompleted: data.completionHistory?.[0] ?? undefined,
      rrule: new RRule({
        ...RRule.parseString(data.recurrenceRule),
        dtstart: data.completionHistory?.[0]?.date ?? data.startDate,
      }),
    }),
    [data],
  )

  return (
    <>
      <FormGroup row>
        <span className="label">Name:</span>
        {data.name}
      </FormGroup>
      <FormGroup>
        <span className="label">Description:</span>
        <TextArea value={data.description ?? "None"} readOnly autoResize />
      </FormGroup>
      <FormGroup row>
        <span className="label">Repeats:</span>
        {rrule.toText()}
      </FormGroup>
      <FormGroup row>
        <span className="label">Next due:</span>
        {toIsoDateString(
          rrule.after(
            lastCompleted?.date ?? data.startDate,
            lastCompleted === undefined,
          ) as Date,
        )}
      </FormGroup>
      {data.completionHistory.length > 0 && (
        <RoutineHistoryTable data={data.completionHistory} />
      )}

      <style jsx>{`
        :global(.routine-history-table) {
          margin-top: 1rem;
        }

        :global(.routine-history-table th) {
          width: fit-content !important;
        }
      `}</style>
    </>
  )
}

export default RoutineDetails
