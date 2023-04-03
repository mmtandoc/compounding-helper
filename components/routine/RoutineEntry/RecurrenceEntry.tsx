import { capitalize } from "lodash"
import { useMemo } from "react"
import { Frequency, RRule } from "rrule"

import { Fieldset, FormGroup, Input, RhfRadioGroup } from "components/ui/forms"
import {
  NullPartialRecurrenceRuleFields,
  monthNames,
  recurrenceRuleSchema,
  weekdayNames,
} from "lib/fields"
import { NestedForm } from "lib/rhf/nestedForm"
import { toIsoDateString } from "lib/utils"

interface RecurrenceEntryProps {
  nestedFormMethods: NestedForm<NullPartialRecurrenceRuleFields>
}

const RecurrenceEntry = ({ nestedFormMethods }: RecurrenceEntryProps) => {
  const { register, watch } = nestedFormMethods

  const { frequency, interval, startDate, byMonth, byWeekday } = watch(
    nestedFormMethods.path(),
  )

  const rrule = useMemo(() => {
    const result = recurrenceRuleSchema.safeParse({
      startDate,
      frequency,
      interval,
      byMonth,
      byWeekday,
    })

    if (result.success) {
      const splitDate = result.data?.startDate
        ?.split("-")
        .map((val) => Number(val))

      return new RRule({
        dtstart:
          result.data.startDate && splitDate
            ? new Date(`${result.data.startDate}T00:00:00.000`) //datetime(splitDate[0], splitDate[1], splitDate[2])
            : undefined,
        freq: result.data.frequency ?? undefined,
        byweekday: result.data.byWeekday ?? undefined,
        bymonth: result.data.byMonth ?? undefined,
        interval: result.data.interval ?? undefined,
      })
    }

    return null
  }, [byMonth, byWeekday, frequency, interval, startDate])

  return (
    <Fieldset className="recurrence-fieldset" legend="Recurrence rule:">
      <FormGroup>
        <label htmlFor="start-date">Start date:</label>
        <Input
          id="start-date"
          type="date"
          {...register(nestedFormMethods.path("startDate"))}
        />
      </FormGroup>
      <FormGroup row>
        <Fieldset legend="Frequency:" className="frequency">
          <RhfRadioGroup
            name={nestedFormMethods.path("frequency")}
            valueAsNumber={true}
            radioOptions={Object.entries(Frequency)
              .filter((entry): entry is [string, Frequency] =>
                isNaN(parseInt(entry[0])),
              )
              .filter((_, freq) => freq <= Frequency.DAILY)
              .map(([name, val]) => [val, capitalize(name)])}
          />
        </Fieldset>
      </FormGroup>
      <FormGroup>
        <label htmlFor="interval">Interval:</label>
        <Input
          type="number"
          id="interval"
          {...register(nestedFormMethods.path("interval"), {
            valueAsNumber: true,
          })}
          min={1}
          size={3}
        />
      </FormGroup>
      <FormGroup>
        <label htmlFor="by-weekday">By Weekday:</label>
        <FormGroup row>
          {weekdayNames.map((name, i) => (
            <label key={i} style={{ display: "flex" }}>
              <Input
                type="checkbox"
                {...register(nestedFormMethods.path("byWeekday"), {
                  setValueAs: (val) => (val === false ? null : val),
                })}
                value={name}
              />
              <span>{name}</span>
            </label>
          ))}
        </FormGroup>
      </FormGroup>
      <FormGroup>
        <label htmlFor="by-month">By Month:</label>
        <FormGroup row>
          {monthNames.map((name, i) => (
            <label key={i} style={{ display: "flex" }}>
              <Input
                type="checkbox"
                {...register(nestedFormMethods.path("byMonth"), {
                  setValueAs: (val) => (val === false ? null : val),
                })}
                value={name}
              />
              <span>{name}</span>
            </label>
          ))}
        </FormGroup>
      </FormGroup>
      {rrule !== null && (
        <fieldset className="example">
          <FormGroup row>
            <span className="label">Routine will occur:</span>
            <span>{rrule.toText()}</span>
          </FormGroup>
          <FormGroup>
            <span className="label">Dates:</span>
            <ol>
              {rrule
                .all((_, len) => len < 4)
                .map((d, i) => (
                  <li key={i}>{toIsoDateString(d)}</li>
                ))}
            </ol>
          </FormGroup>
        </fieldset>
      )}
      <style jsx global>{`
        .example {
          margin-top: 2rem;

          ol {
            margin-block: 0;
          }
        }

        .frequency {
          width: min-content;
        }
      `}</style>
    </Fieldset>
  )
}

export default RecurrenceEntry
