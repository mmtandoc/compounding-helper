import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { sdsWithRelations, SdsWithRelations } from "types/models"
import { ApiBody } from "types/common"
import { SdsFields } from "types/fields"
import SdsMapper from "lib/mappers/SdsMapper"
import _, { update } from "lodash"
import { Prisma } from "@prisma/client"
import SdsHazardMapper from "lib/mappers/SdsHazardMapper"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<SdsWithRelations | undefined>>,
) {
  const { query, method } = req

  const id = query.id ? parseInt(query.id as string) : undefined

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
        sds = await getSdsById(id)
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
      const fields: SdsFields = req.body

      let result
      try {
        result = await updateSdsById(id, fields)
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
    case "DELETE": {
      try {
        await deleteSdsById(id)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(204).send(undefined)
      return
    }
    default:
      res
        .setHeader("Allow", ["GET", "PUT", "DELETE"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
  }
}

export const getSdsById = async (id: number) => {
  return await prisma.sDS.findUnique({
    where: { id },
    ...sdsWithRelations,
  })
}

export const deleteSdsById = async (id: number) => {
  await prisma.hazardCategoryToSDS.deleteMany({ where: { sdsId: id } })

  await prisma.sDS.delete({
    where: { id },
  })
}

export const updateSdsById = async (id: number, fields: SdsFields) => {
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

  return await prisma.sDS.update(updateArgs)
}
