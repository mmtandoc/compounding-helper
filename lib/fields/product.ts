import { Merge, Simplify } from "type-fest"
import * as z from "zod"

import { NullableDeep } from "types/util"

//==== Product schema =====

export const productSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1),
  chemicalId: z.number().int(),
  vendorId: z.number().int(),
})

export type ProductFields = Simplify<z.output<typeof productSchema>>
export type ProductFieldsInput = Simplify<z.input<typeof productSchema>>

export type NullableProductFields = Simplify<
  Merge<NullableDeep<ProductFieldsInput>, Pick<ProductFieldsInput, "id">>
>
