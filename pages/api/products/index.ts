import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { Prisma } from "@prisma/client"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req

  //console.log(req)

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      const filters: Prisma.ProductWhereInput = {}

      const includes: Prisma.ProductInclude = {}

      const includeChemical = true
      const includeSds = true
      const includeVendor = true

      if (includeChemical) {
        includes.chemical = true
      }

      if (includeSds) {
        includes.sds = {
          include: {
            healthHazards: true,
          },
        }
      }

      if (includeVendor) {
        includes.vendor = true
      }

      if (query.chemicalId) {
        if (typeof query.chemicalId === "string") {
          filters.chemicalId = {
            equals: parseInt(query.chemicalId),
          }
        } else {
          filters.chemicalId = {
            in: query.chemicalId.map((id) => parseInt(id)),
          }
        }
      }

      const products = await prisma.product
        .findMany({
          where: filters,
          include: includes,
          orderBy: { id: "asc" },
        })
        .catch((reason) => {
          //TODO: HANDLE ERROR
          console.log(reason)
          res.status(404).json({ error: reason })
          return
        })
      res.status(200).json(products)
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
