import { ForbiddenError, subject } from "@casl/ability"
import { Prisma, User } from "@prisma/client"
import { SetRequired } from "type-fest"

import { getRoleName } from "components/user/utils"
import { defineAbilityForUser } from "lib/auth/ability/appAbilities"
import { UserFields } from "lib/fields"
import UserMapper from "lib/mappers/UserMapper"
import { getUserPrismaClient } from "lib/prisma"
import { userWithPharmacy } from "types/models"

import { AppSession, createAdminSupabase } from "./utils"

export const getUser = async (
  session: AppSession,
  where: Prisma.UserWhereUniqueInput,
) =>
  getUserPrismaClient(session.appUser).user.findUnique({
    where,
    ...userWithPharmacy,
  })

export const getUsers = async (
  session: AppSession,
  args?: Omit<Prisma.UserFindManyArgs, "select" | "include">,
) => {
  const defaultArgs: Omit<Prisma.UserFindManyArgs, "select" | "include"> = {
    orderBy: [{ pharmacyId: "asc" }],
  }

  return await getUserPrismaClient(session.appUser).user.findMany({
    ...defaultArgs,
    ...args,
    ...userWithPharmacy,
  })
}

export const updateUser = async (
  session: AppSession,
  where: SetRequired<Prisma.UserWhereUniqueInput, "id">,
  values: SetRequired<UserFields, "id" | "pharmacyId">,
) =>
  getUserPrismaClient(session.appUser).$transaction(async (tx) => {
    const supabaseAdmin = createAdminSupabase()

    // TODO: Support password changing

    // Throw forbidden error if current user does not have permission to update this user
    ForbiddenError.from(defineAbilityForUser(session.appUser)).throwUnlessCan(
      "update",
      subject("User", { updatedAt: new Date(), ...values }),
    )

    // Need to use auth admin client to allow admins/superadmins to update other users
    const authUserResponse = await supabaseAdmin.auth.admin.updateUserById(
      where.id,
      {
        email: values.email,
      },
    )

    if (authUserResponse.error) {
      throw authUserResponse.error
    }

    const updatedUser = await tx.user.update({
      where,
      data: UserMapper.toModel(values),
      ...userWithPharmacy,
    })

    return updatedUser
  })

export const createUser = async (
  session: AppSession,
  values: SetRequired<UserFields, "password">,
) => {
  ForbiddenError.from(defineAbilityForUser(session.appUser)).throwUnlessCan(
    "create",
    subject("User", {
      id: "aaaaa-bbbb-cccc-ddddd-eeeee",
      pharmacyId: session.appUser.pharmacyId,
      updatedAt: new Date(),
      ...values,
    }),
  )

  const supabaseAdmin = createAdminSupabase()

  console.log({
    app_metadata: {
      pharmacy_id: values.pharmacyId ?? session.appUser.pharmacyId,
    },
  })

  const authUserResponse = await supabaseAdmin.auth.admin.createUser({
    email: values.email,
    email_confirm: process.env.NODE_ENV !== "production",
    password: values.password,
    app_metadata: {
      pharmacy_id: values.pharmacyId ?? session.appUser.pharmacyId,
      role: getRoleName(values.role),
    },
  })

  if (authUserResponse.error) {
    throw authUserResponse.error
  }

  return {
    id: authUserResponse.data.user.id,
    pharmacyId: authUserResponse.data.user.app_metadata.pharmacy_id,
    ...values,
  } as User
}
