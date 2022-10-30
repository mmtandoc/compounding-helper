import { CompoundFields, compoundSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import IngredientMapper from "lib/mappers/IngredientMapper"
import { prisma } from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
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
  const { query, method } = req

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      let compounds

      try {
        compounds = await getCompounds()
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(compounds)
      return
    }
    case "POST": {
      let fields
      try {
        fields = compoundSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      const result = await createCompound(fields)
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
