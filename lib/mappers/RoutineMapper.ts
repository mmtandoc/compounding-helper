import { Prisma } from "@prisma/client"
import { RRule, rrulestr } from "rrule"

import { RoutineFields, RoutineFieldsInput, routineSchema } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { RoutineWithHistory } from "types/models"

const RoutineMapper = {
  toFieldValues: (data: RoutineWithHistory): RoutineFieldsInput => {
    const rrule = rrulestr(data.recurrenceRule).origOptions

    const values = {
      id: data.id,
      pharmacyId: data.pharmacyId,
      name: data.name,
      category: data.category,
      description: data.description,
      recurrenceRule: {
        frequency: rrule.freq,
        byWeekday: rrule.byweekday ?? null,
        byMonth: rrule.bymonth ?? null,
        interval: rrule.interval,
        startDate: toIsoDateString(rrule.dtstart ?? data.startDate),
      },
      isActive: data.isActive,
    } as RoutineFieldsInput

    routineSchema.parse(values) // Will throw if invalid

    return values // Return input values, not transformed output
  },

  toModel: (values: RoutineFields): Prisma.RoutineUncheckedCreateInput => {
    return {
      id: values.id,
      pharmacyId: values.pharmacyId,
      name: values.name,
      category: values.category,
      description: values.description,
      startDate: new Date(values.recurrenceRule.startDate),
      recurrenceRule: new RRule({
        freq: values.recurrenceRule.frequency,
        byweekday: values.recurrenceRule.byWeekday,
        bymonth: values.recurrenceRule.byMonth,
        interval: values.recurrenceRule.interval,
      }).toString(),
      completionHistory: values.completionHistory
        ? { createMany: { data: values.completionHistory } }
        : undefined,
      isActive: values.isActive,
    }
  },
}

export default RoutineMapper
