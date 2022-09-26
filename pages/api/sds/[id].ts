import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { SdsWithRelations } from "types/models"
import { ApiBody } from "types/common"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<SdsWithRelations>>,
) {
  const {
    query: { id },
    method,
  } = req

  if (id === undefined) {
    res.status(404).json({
      error: { code: 404, message: "Missing required query parameter 'id'." },
    })
    return
  }

  switch (method) {
    case "GET": {
      let sds

      try {
        sds = await getSdsById(parseInt(typeof id === "string" ? id : id[0]))
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      if (sds === null) {
        res.status(500).json({
          error: { code: 404, message: `SDS ${id} not found.` },
        })
        return
      }

      res.status(200).json(sds)
      return
    }

    case "PUT": {
      //TODO: Implement PUT method
      throw new Error("PUT method not implemented.")
    }

    default:
      res
        .setHeader("Allow", ["GET", "PUT"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
  }
}

export const getSdsById = async (id: number) => {
  return await prisma.sDS.findUnique({
    where: { id },
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
              parentCategory: true,
              subcategories: true,
            },
          },
        },
      },
    },
  })
}
