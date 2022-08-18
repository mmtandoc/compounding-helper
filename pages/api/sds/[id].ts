import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
    method,
  } = req

  //TODO: Implement other User methods
  switch (method) {
    case "GET": {
      let sds

      try {
        sds = await prisma.sDS.findUnique({
          where: { id: parseInt(id as string) },
          include: {
            product: {
              include: {
                vendor: true,
                chemical: true,
              },
            },
            healthHazards: {
              include: {
                hazardCategory: {
                  include: {
                    hazardClass: true,
                  },
                },
              },
            },
          },
        })
      } catch (error) {
        //TODO: HANDLE ERROR
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json({ ...sds })
      return
    }
    case "PATCH": {
      //TODO: Implement PATCH method
    }

    default:
      res
        .setHeader("Allow", ["GET", "PATCH"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
  }
}
