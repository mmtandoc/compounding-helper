import { User as AuthUser } from "@supabase/supabase-js"

import { getUserPrismaClient } from "lib/prisma"

/**
 *
 * @param currentUser The current Supabase Auth user
 * @param userId The ID of the user to get
 * @returns The User with the specified ID
 */
export const getUserById = async (currentUser: AuthUser, userId: string) =>
  await getUserPrismaClient(currentUser).user.findUniqueOrThrow({
    where: { id: userId },
  })
