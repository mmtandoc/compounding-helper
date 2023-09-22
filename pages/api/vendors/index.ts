import { NextApiResponse } from "next"

import {
  NextApiRequestWithSession,
  sendJsonError,
  withSession,
} from "lib/api/utils"
import { getUserPrismaClient } from "lib/prisma"

async function handler(req: NextApiRequestWithSession, res: NextApiResponse) {
  const { method, session } = req

  //console.log(req)

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      let vendors

      try {
        vendors = await getUserPrismaClient(session.appUser).vendor.findMany({
          orderBy: { id: "asc" },
          include: {
            products: true,
          },
        })
      } catch (error) {
        console.log(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(vendors)
    }
    default:
      return sendJsonError(
        res.setHeader("Allow", ["GET"]),
        405,
        `Method ${method} Not Allowed`,
      )
  }
}

export default withSession(handler)
