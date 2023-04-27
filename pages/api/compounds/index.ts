import { NextApiRequest, NextApiResponse } from "next"

import { sendJsonError } from "lib/api/utils"
import { CompoundFields, compoundSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import IngredientMapper from "lib/mappers/IngredientMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import {
  CompoundWithIngredients,
  compoundWithIngredients as includeAllNested,
} from "types/models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    ApiBody<CompoundWithIngredients[] | CompoundWithIngredients>
  >,
) {
  const { method } = req

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      let compounds

      try {
        compounds = await getCompounds()
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(compounds)
    }
    case "POST": {
      let fields
      try {
        fields = compoundSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      const result = await createCompound(fields)
      res
        .setHeader("Location", `/compounds/${result.id}`)
        .status(201)
        .json(result)
      return
    }
    default:
      return sendJsonError(
        res.setHeader("Allow", ["GET", "POST"]),
        405,
        `Method ${method} Not Allowed`,
      )
  }
}

export const getCompounds = async () =>
  prisma.compound.findMany({
    orderBy: { id: "asc" },
    ...includeAllNested,
  })

export const createCompound = async (fields: CompoundFields) =>
  prisma.compound.create({
    ...includeAllNested,
    data: {
      ingredients: {
        createMany: {
          data: fields.ingredients.map(IngredientMapper.toModel),
        },
      },
      ...CompoundMapper.toModel(fields),
    },
  })
