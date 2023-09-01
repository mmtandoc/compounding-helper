import * as z from "zod"

import { NullableDeep } from "types/util"

//======== Link schema =======

export const linkSchema = z.object({
  id: z.number().int().optional(),
  pharmacyId: z.number().int().optional(),
  url: z.string().trim().min(1).url(),
  name: z.string().trim().min(1),
  description: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable(),
  order: z.number().int().positive().optional(),
})

export type LinkFields = z.output<typeof linkSchema>
export type LinkFieldsInput = z.input<typeof linkSchema>

export type NullableLinkFields = NullableDeep<
  LinkFieldsInput,
  { ignoreKeys: "id" }
>

export const linkDirectorySchema = z.object({ links: linkSchema.array() })
export type LinkDirectoryFields = z.output<typeof linkDirectorySchema>
export type LinkDirectoryFieldsInput = z.input<typeof linkDirectorySchema>

export type NullableLinkDirectoryFields = { links: NullableLinkFields[] }
