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
      const chemical = await prisma.chemical
        .findUnique({
          where: { id: parseInt(id as string) },
          include: {
            nioshList: true,
            products: {
              include: {
                sds: {
                  include: {
                    healthHazards: true,
                  },
                },
              },
            },
          },
        })
        .catch((reason) => {
          //TODO: HANDLE ERROR
          console.log(reason)
          res.status(404).json({ error: reason })
          return
        })

      res.status(200).json({ ...chemical })
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
