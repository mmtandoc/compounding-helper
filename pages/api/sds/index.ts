import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { Prisma } from "@prisma/client"
import _ from "lodash"
import { SdsFields } from "types/fields"
import SdsMapper from "lib/mappers/SdsMapper"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req

  //console.log(req)

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      const filters: Prisma.SDSWhereInput = {}

      //TODO: Refactor
      if (
        Object.hasOwn(query, "chemicalId") &&
        query.chemicalId !== undefined
      ) {
        if (typeof query.chemicalId === "string") {
          _.set(filters, "product.chemicalId", {
            equals: parseInt(query.chemicalId),
          })
        } else {
          _.set(filters, "product.id", {
            in: query.chemicalId.map((id) => parseInt(id)),
          })
        }
      }

      if (Object.hasOwn(query, "productId") && query.productId !== undefined) {
        if (typeof query.productId === "string") {
          _.set(filters, "product.id", {
            equals: parseInt(query.productId),
          })
        } else {
          _.set(filters, "product.id", {
            in: query.productId.map((id) => parseInt(id)),
          })
        }
      }

      let safetyDatasheets

      try {
        safetyDatasheets = await prisma.sDS.findMany({
          where: filters,
          orderBy: { revisionDate: "desc" },
          include: {
            product: {
              include: {
                vendor: true,
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

      res.status(200).json(safetyDatasheets)
      return
    }
    case "POST": {
      const fields: SdsFields = req.body

      let result
      try {
        result = await createSds(fields)
      } catch (error) {
        //TODO: HANDLE ERROR
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

export const createSds = async (fields: SdsFields) => {
  return await prisma.sDS.create({
    data: {
      healthHazards: {
        createMany: {
          data: fields.hazards
            .filter((h) => h.classId !== null && h.categoryId !== null)
            .map((h) => ({
              hazardCategoryId:
                (h?.subcategoryId as number) ?? (h.categoryId as number),
              additionalInfo: h.additionalInfo ?? undefined,
            })),
        },
      },
      ...SdsMapper.toModel(fields),
    },
  })
}
