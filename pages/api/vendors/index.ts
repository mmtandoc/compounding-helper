import { NextApiRequest, NextApiResponse } from "next"

import { sendJsonError } from "lib/api/utils"
import { prisma } from "lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req

  //console.log(req)

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      let vendors

      try {
        vendors = await prisma.vendor.findMany({
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
