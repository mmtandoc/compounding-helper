import { Storage, TimeUnit, Unit } from "@prisma/client"
import { Simplify } from "type-fest"
import * as z from "zod"

import { NullPartialDeep } from "types/util"

import { utcDateZodString } from "./utils"

//==== MFR schema ====//

export const quantitySchema = z.object({
  amount: z.number().positive(),
  unit: z.nativeEnum(Unit),
})

export type Quantity = z.output<typeof quantitySchema>

export const mfrSchema = z.object({
  compoundId: z.number().int(),
  version: z.number().int().min(0).optional(),
  pharmaceuticalForm: z.string().trim().min(1),
  routeOfAdministration: z.string().trim().min(1),
  riskAssessmentId: z.number().int(),
  quantities: quantitySchema.array().min(1),
  expectedYield: quantitySchema,
  training: z.string().trim().min(1).array(),
  requiredEquipment: z.string().trim().min(1).array().min(1),
  calculations: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable()
    .default(null),
  compoundingMethod: z.string().trim().min(1),
  qualityControls: z
    .object({
      name: z.string().trim().min(1),
      expectedSpecification: z.string().trim().min(1),
    })
    .array()
    .min(1),
  packaging: z.string().trim().min(1),
  beyondUseDate: z.object({
    value: z.number().int().positive(),
    unit: z.nativeEnum(TimeUnit),
  }),
  storage: z.nativeEnum(Storage),
  labelling: z.string().trim().min(1).array().min(1),
  references: z.string().trim().min(1).array().min(1),
  developedBy: z.string().trim().min(1),
  verifiedBy: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable()
    .default(null),
  effectiveDate: utcDateZodString,
})

export type MfrFields = Simplify<z.output<typeof mfrSchema>>
const mfrSchemaWithVersion = mfrSchema.extend(
  mfrSchema.pick({ version: true }).required().shape,
)

export type MfrFieldsWithVersion = Simplify<
  z.output<typeof mfrSchemaWithVersion>
>

export type MfrFieldsInput = Simplify<z.input<typeof mfrSchema>>

export type NullPartialMfrFields = Simplify<
  NullPartialDeep<MfrFieldsInput, { ignoreKeys: "compoundId" | "version" }>
>
