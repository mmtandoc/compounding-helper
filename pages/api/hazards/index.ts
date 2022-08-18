import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req

  switch (method) {
    case "GET": {
      let hazards
      try {
        hazards = await prisma.hazardClass.findMany({
          include: {
            hazardCategories: {
              orderBy: { level: "desc" },
              where: { parentLevel: { equals: null } },
              include: { subcategories: { orderBy: { level: "desc" } } },
            },
          },
          orderBy: { id: "asc" },
        })
      } catch (error) {
        //TODO: HANDLE ERROR
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(hazards)
      return
    }
    default:
      res
        .setHeader("Allow", ["GET"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
  }
}
