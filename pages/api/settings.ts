import { Prisma, Settings } from "@prisma/client"
import { User as AuthUser } from "@supabase/supabase-js"
import { NextApiRequest, NextApiResponse } from "next"
import { SetOptional } from "type-fest"

import { getUserById } from "lib/api/users"
import {
  NextApiRequestWithSession,
  sendJsonError,
  withSession,
} from "lib/api/utils"
import { settingsSchema } from "lib/fields"
import { forUser, getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"

const BASE_ID = 0

async function handler(
  req: NextApiRequestWithSession,
  res: NextApiResponse<ApiBody<Settings | null>>,
) {
  const { body, method, session } = req

  switch (method) {
    case "GET": {
      let settings

      try {
        settings = await getSettings(session.user)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(settings)
    }
    case "PUT": {
      let data
      try {
        data = settingsSchema.parse(body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let result
      try {
        result =
          (await getSettings(session.user)) !== null
            ? await updateSettings(session.user, data)
            : await createSettings(session.user, data)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(result)
    }
    default:
      return sendJsonError(
        res.setHeader("Allow", ["GET", "POST"]),
        405,
        `Method ${method} Not Allowed`,
      )
  }
}

export default withSession(handler)

export const getSettings = async (user: AuthUser) =>
  getUserPrismaClient(user).settings.findUnique({
    where: { pharmacyId: (await getUserById(user, user.id)).pharmacyId },
  })

export const createSettings = async (
  user: AuthUser,
  data: SetOptional<Prisma.SettingsCreateArgs["data"], "pharmacyId">,
) =>
  getUserPrismaClient(user).settings.create({
    data: {
      pharmacyId: (await getUserById(user, user.id)).pharmacyId,
      ...settingsSchema.parse(data),
    },
  })

export const updateSettings = async (
  user: AuthUser,
  data: Prisma.SettingsUpdateArgs["data"],
) =>
  getUserPrismaClient(user).settings.update({
    where: { pharmacyId: (await getUserById(user, user.id)).pharmacyId },
    data: settingsSchema.parse(data),
  })
