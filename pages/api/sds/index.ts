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

  const latestOnly = query["latestOnly"] !== undefined

  const offset = query.offset ? parseInt(query.offset as string) : undefined
  const limit = query.offset ? parseInt(query.limit as string) : undefined

  //console.log(req)

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      const findManyArgs: Prisma.SDSFindManyArgs = { skip: offset, take: limit }

      if (query.chemicalId !== undefined) {
        findManyArgs.where = {
          product: {
            chemicalId: {
              in: (Array.isArray(query.chemicalId)
                ? query.chemicalId
                : [query.chemicalId]
              ).map((id) => parseInt(id)),
            },
          },
          ...findManyArgs.where,
        }
      }

      if (query.productId !== undefined) {
        findManyArgs.where = {
          productId: {
            in: (Array.isArray(query.productId)
              ? query.productId
              : [query.productId]
            ).map((id) => parseInt(id)),
          },
          ...findManyArgs.where,
        }
      }

      if (latestOnly) {
        findManyArgs.distinct = "productId"
        findManyArgs.orderBy = { revisionDate: "desc" }
      }

      let safetyDatasheets

      try {
        safetyDatasheets = await getSafetyDataSheets(findManyArgs)
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

export const getSafetyDataSheets = async (
  args?: Omit<Prisma.SDSFindManyArgs, "select" | "include">,
) => prisma.sDS.findMany({ ...args, ...sdsWithRelations })
