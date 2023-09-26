import { ForbiddenError } from "@casl/ability"
import { Prisma } from "@prisma/client"

import {
  AppSession,
  sendForbiddenError,
  sendJsonError,
  withSession,
} from "lib/api/utils"
import { SdsFields, sdsSchema } from "lib/fields"
import SdsMapper from "lib/mappers/SdsMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { SdsWithRelations, sdsWithRelations } from "types/models"

const handler = withSession<ApiBody<SdsWithRelations[] | SdsWithRelations>>(
  async (req, res) => {
    const { query, method, session } = req

    const latestOnly = query["latestOnly"] !== undefined

    const offset = query.offset ? parseInt(query.offset as string) : undefined
    const limit = query.offset ? parseInt(query.limit as string) : undefined

    //console.log(req)

    //TODO: Implement filtering
    switch (method) {
      case "GET": {
        const findManyArgs: Prisma.SDSFindManyArgs = {
          skip: offset,
          take: limit,
        }

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
          safetyDatasheets = await getSafetyDataSheets(session, findManyArgs)
        } catch (error) {
          console.log(error)
          if (error instanceof ForbiddenError) {
            return sendForbiddenError(res, error)
          }
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(200).json(safetyDatasheets)
      }
      case "POST": {
        let fields
        try {
          fields = sdsSchema.parse(req.body)
        } catch (error) {
          console.log(req.body)
          console.error(error)
          return sendJsonError(res, 400, "Body is invalid.")
        }

        let result
        try {
          result = await createSds(session, fields)
        } catch (error) {
          console.log(error)
          if (error instanceof ForbiddenError) {
            return sendForbiddenError(res, error)
          }
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        res.setHeader("Location", `/sds/${result.id}`).status(201).json(result)
        return
      }
      default:
        return sendJsonError(
          res.setHeader("Allow", ["GET", "POST"]),
          405,
          `Method ${method} Not Allowed`,
        )
    }
  },
)

export default handler

export const createSds = async (session: AppSession, fields: SdsFields) => {
  return await getUserPrismaClient(session.appUser).sDS.create({
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
  session: AppSession,
  args?: Omit<Prisma.SDSFindManyArgs, "select" | "include">,
) =>
  getUserPrismaClient(session.appUser).sDS.findMany({
    ...args,
    ...sdsWithRelations,
  })
