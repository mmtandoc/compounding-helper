import { Prisma, Settings } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import { sendJsonError } from "lib/api/utils"
import { settingsSchema } from "lib/fields"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"

const BASE_ID = 0

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<Settings | null>>,
) {
  const { body, method } = req

  switch (method) {
    case "GET": {
      let settings

      try {
        settings = await getSettings()
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
          (await getSettings()) !== null
            ? await updateSettings(data)
            : await createSettings(data)
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

export const getSettings = async () =>
  prisma.settings.findUnique({ where: { id: BASE_ID } })

export const createSettings = async (data: Prisma.SettingsCreateArgs["data"]) =>
  prisma.settings.create({ data: settingsSchema.parse(data) })

export const updateSettings = async (data: Prisma.SettingsUpdateArgs["data"]) =>
  prisma.settings.update({
    where: { id: BASE_ID },
    data: settingsSchema.parse(data),
  })
