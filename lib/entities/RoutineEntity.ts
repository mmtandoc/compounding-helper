import { Routine, RoutineCompletion } from "@prisma/client"
import { isPast } from "date-fns"
import { RRule } from "rrule"

import { RoutineWithHistory } from "types/models"

type Completion = Omit<RoutineCompletion, "routineId">

export default class RoutineEntity implements Routine {
  id!: number
  category!: string | null
  name!: string
  description!: string | null
  startDate!: Date
  recurrenceRule!: string
  isActive!: boolean
  completionHistory!: Completion[]

  constructor(dataModel: RoutineWithHistory) {
    Object.assign(this, dataModel)
  }

  getLastCompleted() {
    return this.completionHistory.length > 0 ? this.completionHistory[0] : null
  }

  getRRule() {
    return new RRule({
      ...RRule.parseString(this.recurrenceRule),
      dtstart: this.getLastCompleted()?.date ?? this.startDate,
    })
  }

  getDueDate() {
    const lastCompleted = this.getLastCompleted()
    return this.getRRule().after(
      lastCompleted?.date ?? this.startDate,
      lastCompleted === undefined,
    )
  }

  isOverdue() {
    const dueDate = this.getDueDate()
    return dueDate ? isPast(dueDate) : false
  }
}
