import { Prisma } from "@prisma/client"
import { User as AuthUser } from "@supabase/supabase-js"
import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

import { sendJsonError, sendZodError, withSession } from "lib/api/utils"
import { SdsFields, sdsSchema } from "lib/fields"
import SdsHazardMapper from "lib/mappers/SdsHazardMapper"
import SdsMapper from "lib/mappers/SdsMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { SdsWithRelations, sdsWithRelations } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<SdsWithRelations | undefined>>(
  async (req, res) => {
    const { method, session } = req
    const results = querySchema.safeParse(req.query)

    if (!results.success) {
      return sendZodError(res, results.error)
    }

    const id = results.data.id

    switch (method) {
      case "GET": {
        let sds

        try {
          sds = await getSdsById(session.user, id)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        if (sds === null) {
          return sendJsonError(res, 404, `SDS ${id} not found.`)
        }

        return res.status(200).json(sds)
      }
      case "PUT": {
        let fields
        try {
          fields = sdsSchema.parse(req.body)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 400, "Body is invalid.")
        }

        let result
        try {
          result = await updateSdsById(session.user, id, fields)
        } catch (error) {
          console.log(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(200).json(result)
      }
      case "DELETE": {
        try {
          await deleteSdsById(session.user, id)
        } catch (error) {
          console.error(error)
          // Unable to delete due to existing reference
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
          ) {
            return sendJsonError(
              res,
              409,
              "Unable to delete due to SDS being referenced by other records (i.e., risk assessments).",
            )
          }

          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(204).send(undefined)
      }
      default:
        return sendJsonError(
          res.setHeader("Allow", ["GET", "PUT", "DELETE"]),
          405,
          `Method ${method} Not Allowed`,
        )
    }
  },
)

export default handler

export const getSdsById = async (currentUser: AuthUser, id: number) => {
  return await getUserPrismaClient(currentUser).sDS.findUnique({
    where: { id },
    ...sdsWithRelations,
  })
}

export const deleteSdsById = async (currentUser: AuthUser, id: number) => {
  const prismaClient = getUserPrismaClient(currentUser)

  await prismaClient.$transaction([
    prismaClient.hazardCategoryToSDS.deleteMany({ where: { sdsId: id } }),
    prismaClient.sDS.delete({
      where: { id },
    }),
  ])
}

export const updateSdsById = async (
  currentUser: AuthUser,
  id: number,
  fields: SdsFields,
) => {
  const hazards = fields.hazards
    .filter((h) => h.classId !== null && h.categoryId !== null)
    .map(SdsHazardMapper.toModel)

  const updateArgs = Prisma.validator<Prisma.SDSUpdateArgs>()({
    where: { id },
    data: {
      healthHazards: {
        deleteMany: {
          id: {
            notIn: fields.hazards
              .filter((h) => h.id)
              .map((h) => h.id as number),
          },
        },
        createMany: {
          data: hazards.filter((data) => !data.id),
        },
        update: hazards
          .filter((data) => !!data.id)
          .map((data) => ({
            where: { id: data.id },
            data: _.omit(data, "id"),
          })),
      },
      ..._.omit(SdsMapper.toModel(fields), "id"),
    },
    ...sdsWithRelations,
  })

  console.dir(updateArgs, { depth: null })

  return await getUserPrismaClient(currentUser).sDS.update(updateArgs)
}
