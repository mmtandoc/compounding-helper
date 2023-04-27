import { Link, Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import { sendJsonError } from "lib/api/utils"
import { linkDirectorySchema } from "lib/fields"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<Link[]>>,
) {
  const { body, method } = req

  switch (method) {
    case "GET": {
      let links

      try {
        links = await getLinks()
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(links)
    }
    case "PUT": {
      let data
      try {
        data = linkDirectorySchema.parse(body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let result
      try {
        result = await setLinks(data.links)
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

export const getLinks = async () =>
  prisma.link.findMany({ orderBy: { order: "asc" } })

export const setLinks = async (data: Prisma.LinkCreateManyArgs["data"]) => {
  const [, , result] = await prisma.$transaction([
    prisma.link.deleteMany(),
    prisma.link.createMany({ data }),
    prisma.link.findMany({ orderBy: { order: "asc" } }),
  ])
  return result
}
