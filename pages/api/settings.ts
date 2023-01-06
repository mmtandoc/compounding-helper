import { Prisma, Settings } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import { settingsSchema } from "lib/fields"
import { prisma } from "lib/prisma"
import { capitalize } from "lib/utils"
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
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(settings)
      return
    }
    case "PUT": {
      let data
      try {
        data = settingsSchema.parse(body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 404, message: "Body is invalid." },
        })
        return
      }

      let result
      try {
        result =
          (await getSettings()) !== null
            ? await updateSettings(data)
            : await createSettings(data)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(result)
      return
    }
    default:
      res
        .setHeader("Allow", ["GET", "POST"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
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
