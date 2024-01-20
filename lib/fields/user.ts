import { Role } from "@prisma/client"
import { Simplify } from "type-fest"
import * as z from "zod"

import { Merge, NullableDeep } from "types/util"

//==== User schema =====

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  pharmacyId: z.number().int().optional(),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(Role),
  updatedAt: z.coerce.date().optional(),
})

export type UserFields = Simplify<z.output<typeof userSchema>>
export type UserFieldsInput = Simplify<z.input<typeof userSchema>>

export type NullableUserFields = Simplify<
  Merge<
    NullableDeep<UserFieldsInput>,
    Pick<UserFieldsInput, "id" | "pharmacyId">
  >
>

//==== Profile schema =====
export const profileSchema = userSchema.omit({ password: true })

export type ProfileFields = Simplify<z.output<typeof profileSchema>>
export type ProfileFieldsInput = Simplify<z.input<typeof profileSchema>>

export type NullableProfileFields = Simplify<
  Merge<
    NullableDeep<ProfileFieldsInput>,
    Pick<ProfileFieldsInput, "id" | "pharmacyId">
  >
>
