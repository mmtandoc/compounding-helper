import { Prisma, User } from "@prisma/client"
import { SetRequired } from "type-fest"

import { UserFields, userSchema } from "lib/fields"

const UserMapper = {
  toFieldValues: (data: User): UserFields => {
    return userSchema.parse({
      id: data.id,
      pharmacyId: data.pharmacyId,
      email: data.email,
      role: data.role,
    })
  },

  toModel: (
    values: SetRequired<UserFields, "id" | "pharmacyId">,
  ): Prisma.UserUncheckedCreateInput => {
    return {
      id: values.id,
      pharmacyId: values.pharmacyId,
      email: values.email,
      role: values.role,
    }
  },
}

export default UserMapper
