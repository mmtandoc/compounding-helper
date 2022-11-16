import { Link, Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import { linkDirectorySchema, linkSchema } from "lib/fields"
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
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(links)
      return
    }
    case "PUT": {
      let data
      try {
        data = linkDirectorySchema.parse(body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      let result
      try {
        result = await setLinks(data.links)
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

export const getLinks = async () =>
  prisma.link.findMany({ orderBy: { order: "asc" } })

export const setLinks = async (data: Prisma.LinkCreateManyArgs["data"]) => {
  prisma.$transaction([
    prisma.link.deleteMany(),
    prisma.link.createMany({ data }),
  ])
  return getLinks()
}
