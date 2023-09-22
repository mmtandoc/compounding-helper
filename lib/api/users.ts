import { getUserPrismaClient } from "lib/prisma"
import { userWithPharmacy } from "types/models"

import { AppSession } from "./utils"

/**
 *
 * @param session The current app session
 * @param userId The ID of the user to get
 * @returns The User with the specified ID
 */
export const getUserById = async (session: AppSession, userId: string) =>
  await getUserPrismaClient(session.appUser).user.findUniqueOrThrow({
    where: { id: userId },
    ...userWithPharmacy,
  })
