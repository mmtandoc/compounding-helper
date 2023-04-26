import { Frequency, Weekday, rrulestr } from "rrule"
import { Merge, Simplify } from "type-fest"
import * as z from "zod"

import { NullPartial, NullPartialDeep } from "types/util"

import { isoDateZodString } from "./utils"

//===== Recurrence schema =====

export const weekdayNames: readonly [string, ...string[]] = [
  "MO",
  "TU",
  "WE",
  "TH",
  "FR",
  "SA",
  "SU",
]

const weekdaysSchema = z
  .enum(weekdayNames)
  .transform((val) => weekdayNames.indexOf(val))
  .or(z.number().min(0).max(6))
  .transform((val) => new Weekday(val))

export const monthNames: readonly [string, ...string[]] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const monthsSchema = z
  .enum(monthNames)
  .transform((arg) => monthNames.indexOf(arg) + 1)
  .or(z.number().min(1).max(12))

// Schema for recurrence rules from https://github.com/jakubroztocil/rrule

export const recurrenceRuleSchema = z.object({
  frequency: z.nativeEnum(Frequency),
  startDate: isoDateZodString(),
  interval: z.number().positive(),
  byWeekday: z
    .array(weekdaysSchema)
    .transform((arg) => (arg.length === 0 ? undefined : arg))
    .or(weekdaysSchema)
    .nullish(),
  byMonth: z
    .array(monthsSchema)
    .transform((arg) => (arg.length === 0 ? undefined : arg))
    .or(monthsSchema)
    .nullish(),
})

export type RecurrenceRuleFields = z.output<typeof recurrenceRuleSchema>
export type RecurrenceRuleFieldsInput = z.input<typeof recurrenceRuleSchema>

export type NullPartialRecurrenceRuleFields = Merge<
  NullPartialDeep<RecurrenceRuleFields, { ignoreKeys: "byWeekday" }>,
  NullPartial<Pick<RecurrenceRuleFields, "byWeekday">>
>

//==== Routine schema =====

export const completionSchema = z.object({
  date: isoDateZodString().transform((d) => new Date(d)),
  name: z.string(),
})

export type CompletionFields = z.output<typeof completionSchema>
export type CompletionFieldsInput = z.input<typeof completionSchema>

export type NullPartialCompletionFields = NullPartialDeep<CompletionFieldsInput>

export const routineSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1),
  category: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable()
    .default(null),
  description: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable()
    .default(null),
  recurrenceRule: recurrenceRuleSchema,
  completionHistory: completionSchema.array().optional(),
  isActive: z.boolean().optional(),
})

export type RoutineFields = z.output<typeof routineSchema>
export type RoutineFieldsInput = z.input<typeof routineSchema>

export type NullPartialRoutineFields = Simplify<
  Merge<
    Merge<NullPartialDeep<RoutineFieldsInput>, Pick<RoutineFieldsInput, "id">>,
    { recurrenceRule: NullPartialRecurrenceRuleFields }
  >
>

/* export const taskSchema = z.object({
  routineId: z.number().int(),
  dueDate: z.date(),
  completionDate: z.date().optional(),
})

export type TaskFields = z.output<typeof taskSchema>
export type TaskFieldsInput = z.input<typeof taskSchema>

export type NullPartialTaskFields = Simplify<
  Merge<NullPartialDeep<RoutineFieldsInput>, Pick<RoutineFieldsInput, "id">>
>
 */