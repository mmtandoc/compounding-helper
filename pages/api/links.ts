import { Link, Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import {
  AppSession,
  NextApiRequestWithSession,
  sendJsonError,
  withSession,
} from "lib/api/utils"
import { linkDirectorySchema } from "lib/fields"
import { forUser, forUserTx, getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"

const handler = withSession<ApiBody<Link[]>>(async (req, res) => {
  const { body, method, session } = req

  switch (method) {
    case "GET": {
      let links

      try {
        links = await getLinks(session)
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
        result = await setLinks(session, data.links)
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
})

export default handler

export const getLinks = async (session: AppSession) =>
  getUserPrismaClient(session.authSession.user).link.findMany({
    orderBy: { order: "asc" },
  })

export const setLinks = async (
  session: AppSession,
  data: Prisma.LinkCreateManyArgs["data"],
) => {
  const client = getUserPrismaClient(session.authSession.user)
  const [, , result] = await client.$transaction([
    client.link.deleteMany(),
    client.link.createMany({ data }),
    client.link.findMany({ orderBy: { order: "asc" } }),
  ])
  return result
}
