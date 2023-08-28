import { Simplify } from "type-fest"
import * as z from "zod"

import { Merge, NullableDeep } from "types/util"

import { isoDateZodString, transformStringToNumber } from "./utils"

//==== SDS & Hazard schemas =====

export const hazardSchema = z.object({
  id: z.number().int().optional(),
  classId: z.number(),
  categoryId: z.number(),
  subcategoryId: z.number().nullable(),
  additionalInfo: z.string().trim().min(1).optional(),
})

export type HazardFields = Simplify<z.output<typeof hazardSchema>>
export type HazardFieldsInput = Simplify<z.input<typeof hazardSchema>>

export type NullableHazardFields = Simplify<NullableDeep<HazardFieldsInput>>

export const sdsSchema = z.object({
  id: z.number().int().optional(),
  pharmacyId: z.number().int().nullish(),
  chemicalId: z.number().int(),
  productId: z.number().int(),
  hmisHazardLevel: transformStringToNumber(
    z
      .number({
        invalid_type_error: "HMIS health hazard level must be a number.",
      })
      .int("HMIS health hazard level must be an integer")
      .min(0, "HMIS health hazard level must a number from 0 to 4.")
      .max(4, "HMIS health hazard level must a number from 0 to 4."),
  ),
  revisionDate: isoDateZodString(),
  requireVentilation: z.boolean(),
  hazards: z.array(hazardSchema),
})

export type SdsFields = z.output<typeof sdsSchema>
export type SdsFieldsInput = z.input<typeof sdsSchema>

export type NullableSdsFields = Simplify<
  Merge<NullableDeep<SdsFieldsInput>, Pick<SdsFieldsInput, "id">>
>
