import { Prisma, Settings } from "@prisma/client"
import { NextApiResponse } from "next"
import { SetOptional } from "type-fest"

import {
  AppSession,
  NextApiRequestWithSession,
  sendJsonError,
  withSession,
} from "lib/api/utils"
import { settingsSchema } from "lib/fields"
import { getUserPrismaClient } from "lib/prisma"
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
        settings = await getSettings(session)
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
          (await getSettings(session)) !== null
            ? await updateSettings(session, data)
            : await createSettings(session, data)
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

export const getSettings = async (session: AppSession) =>
  getUserPrismaClient(session.authSession.user).settings.findUnique({
    where: { pharmacyId: session.appUser.pharmacyId },
  })

export const createSettings = async (
  session: AppSession,
  data: SetOptional<Prisma.SettingsCreateArgs["data"], "pharmacyId">,
) =>
  getUserPrismaClient(session.authSession.user).settings.create({
    data: {
      pharmacyId: session.appUser.pharmacyId,
      ...settingsSchema.parse(data),
    },
  })

export const updateSettings = async (
  session: AppSession,
  data: Prisma.SettingsUpdateArgs["data"],
) =>
  getUserPrismaClient(session.authSession.user).settings.update({
    where: {
      pharmacyId: session.appUser.pharmacyId,
    },
    data: settingsSchema.parse(data),
  })
