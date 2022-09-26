import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { Prisma } from "@prisma/client"
import _ from "lodash"
import { SdsFields } from "types/fields"
import SdsMapper from "lib/mappers/SdsMapper"
import { ApiBody } from "types/common"
import { sdsWithRelations, SdsWithRelations } from "types/models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<SdsWithRelations[] | SdsWithRelations>>,
) {
  const { query, method } = req

  const offset = query.offset ? parseInt(query.offset as string) : undefined
  const limit = query.offset ? parseInt(query.limit as string) : undefined

  //console.log(req)

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      let where: Prisma.SDSWhereInput = {}

      if (query.chemicalId !== undefined) {
        where = {
          product: {
            chemicalId: {
              in: (Array.isArray(query.chemicalId)
                ? query.chemicalId
                : [query.chemicalId]
              ).map((id) => parseInt(id)),
            },
          },
          ...where,
        }
      }

      if (query.productId !== undefined) {
        where = {
          productId: {
            in: (Array.isArray(query.productId)
              ? query.productId
              : [query.productId]
            ).map((id) => parseInt(id)),
          },
          ...where,
        }
      }

      let safetyDatasheets

      try {
        safetyDatasheets = await getSafetyDataSheets({ where, offset, limit })
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
    ...sdsWithRelations,
  })
}

export const getSafetyDataSheets = async (options?: {
  where?: Prisma.SDSWhereInput
  offset?: number
  limit?: number
  orderBy?:
    | Prisma.SDSOrderByWithRelationInput
    | Array<Prisma.SDSOrderByWithRelationInput>
}) => {
  const { where, offset, limit, orderBy } = options ?? {}
  return await prisma.sDS.findMany({
    where,
    orderBy: orderBy,
    skip: offset,
    take: limit,
    ...sdsWithRelations,
  })
}
