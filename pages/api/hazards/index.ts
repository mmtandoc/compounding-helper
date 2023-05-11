import { NextApiRequest, NextApiResponse } from "next"

import { sendJsonError } from "lib/api/utils"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { HazardClassesWithCategories } from "types/models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<HazardClassesWithCategories[]>>,
) {
  const { method } = req

  switch (method) {
    case "GET": {
      let hazards
      try {
        hazards = await getHazards()
      } catch (error) {
        console.log(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(hazards)
    }
    default:
      return sendJsonError(
        res.setHeader("Allow", ["GET"]),
        405,
        `Method ${method} Not Allowed`,
      )
  }
}

export async function getHazards() {
  return await prisma.hazardClass.findMany({
    include: {
      hazardCategories: {
        orderBy: { level: "desc" },
        where: { parentLevel: { equals: null } },
        include: { subcategories: { orderBy: { level: "desc" } } },
      },
    },
    orderBy: { id: "asc" },
  })
}
