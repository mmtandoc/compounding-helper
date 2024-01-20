import { ForbiddenError } from "@casl/ability"

import {
  AppSession,
  sendForbiddenError,
  sendJsonError,
  withSession,
} from "lib/api/utils"
import { CompoundFields, compoundSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import IngredientMapper from "lib/mappers/IngredientMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import {
  CompoundWithIngredients,
  compoundWithIngredients as includeAllNested,
} from "types/models"

const handler = withSession<
  ApiBody<CompoundWithIngredients[] | CompoundWithIngredients>
>(async (req, res) => {
  const { method, session } = req

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      let compounds

      try {
        compounds = await getCompounds(session)
      } catch (error) {
        console.error(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }
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
      let result

      try {
        result = await createCompound(session, fields)
      } catch (error) {
        console.error(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }
        return sendJsonError(res, 500, "Encountered error with database.")
      }

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
})

export default handler

export const getCompounds = async (session: AppSession) =>
  getUserPrismaClient(session.appUser).compound.findMany({
    orderBy: { id: "asc" },
    ...includeAllNested,
  })

export const createCompound = async (
  session: AppSession,
  fields: CompoundFields,
) =>
  getUserPrismaClient(session.appUser).compound.create({
    ...includeAllNested,
    data: {
      ingredients: {
        createMany: {
          data: fields.ingredients.map(IngredientMapper.toModel),
        },
      },
      ...CompoundMapper.toModel({
        pharmacyId: session.appUser.pharmacyId, // pharmacyId can't be undefined for checking permissions
        ...fields,
      }),
    },
  })
