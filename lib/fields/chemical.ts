import { Simplify } from "type-fest"
import * as z from "zod"

import { Merge, NullableDeep } from "types/util"

import { isoDateZodString } from "./utils"

//==== Chemical schema =====

export const chemicalSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1),
  casNumber: z
    .string()
    .trim()
    .superRefine((arg, ctx) => {
      if (!/\d{2,7}-\d{2}-\d{1}/.test(arg)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "regex",
          message:
            "CAS number must be in the form of XXXXXXX-YY-Z, where the first part X is 2 to 7 digits long.",
          fatal: true,
        })
        return z.NEVER
      }
      /*
       The check digit is found by taking the last digit times 1,
       the preceding digit times 2, the preceding digit times 3 etc.,
       adding all these up and computing the sum modulo 10.
      */
      const digits = Array.from(arg.replaceAll("-", "")).map(Number)
      const checkDigit = digits.pop()
      digits.reverse()
      const checksum =
        digits.reduce((sum, digit, i) => sum + digit * (i + 1), 0) % 10
      if (checkDigit !== checksum) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "CAS number is invalid. Please double check that the CAS number was inputted correctly.",
        })
      }
    })
    .nullish(),
  hasNoCasNumber: z.boolean(),
  synonyms: z.array(z.string().trim().min(1)).nullable(),
  nioshTable: z.number().int().min(1).max(3).or(z.literal(-1)),
  nioshRevisionDate: isoDateZodString().nullable(), //TODO: Check that date is not in the future
  additionalInfo: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable()
    .default(null),
})

export type ChemicalFields = z.output<typeof chemicalSchema>
export type ChemicalFieldsInput = z.input<typeof chemicalSchema>

export type NullableChemicalFields = Simplify<
  Merge<NullableDeep<ChemicalFieldsInput>, Pick<ChemicalFieldsInput, "id">>
>
