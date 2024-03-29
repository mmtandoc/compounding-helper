import { ForbiddenError } from "@casl/ability"
import { Prisma } from "@prisma/client"
import _ from "lodash"
import { z } from "zod"

import {
  AppSession,
  sendForbiddenError,
  sendJsonError,
  sendZodError,
  withSession,
} from "lib/api/utils"
import { riskAssessmentSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import IngredientMapper from "lib/mappers/IngredientMapper"
import RiskAssessmentMapper from "lib/mappers/RiskAssessmentMapper"
import { getUserPrismaClient } from "lib/prisma"
import { deleteCompoundById } from "pages/api/compounds/[id]"
import { ApiBody } from "types/common"
import { RiskAssessmentAll, compoundWithIngredients } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<RiskAssessmentAll> | string>(
  async (req, res) => {
    const { body, method, session } = req

    const results = querySchema.safeParse(req.query)

    if (!results.success) return sendZodError(res, results.error)

    const id = results.data.id

    switch (method) {
      case "GET": {
        let riskAssessment
        try {
          riskAssessment = await getRiskAssessmentById(session, id)
        } catch (error) {
          console.error(error)
          if (error instanceof ForbiddenError) {
            return sendForbiddenError(res, error)
          }
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        if (riskAssessment === null) {
          return sendJsonError(res, 404, `Risk assessment ${id} not found.`)
        }

        return res.status(200).json(riskAssessment)
      }
      case "PUT": {
        let fields
        try {
          fields = riskAssessmentSchema.parse(body)
        } catch (error) {
          console.error(error)
          if (error instanceof ForbiddenError) {
            return sendForbiddenError(res, error)
          }
          return sendJsonError(res, 400, "Body is invalid.")
        }

        const compound = CompoundMapper.toModel(fields.compound)
        const ingredients = fields.compound.ingredients.map(
          IngredientMapper.toModel,
        )

        let riskAssessment
        try {
          riskAssessment = await updateRiskAssessmentById(session, id, {
            ..._.omit(
              RiskAssessmentMapper.toModel(fields),
              "id",
              "compoundId",
              "pharmacyId",
            ),
            compound: {
              upsert: {
                create: {
                  ...compound,
                  ingredients: {
                    createMany: {
                      data: ingredients,
                    },
                  },
                },
                update: {
                  ...compound,
                  ingredients: {
                    deleteMany: {},
                    createMany: {
                      data: ingredients,
                    },
                  },
                },
              },
            },
          })
        } catch (error) {
          console.error(error)
          if (error instanceof ForbiddenError) {
            return sendForbiddenError(res, error)
          }
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        if (riskAssessment === null) {
          return sendJsonError(res, 404, `Risk assessment ${id} not found.`)
        }

        return res.status(200).json(riskAssessment)
      }
      case "DELETE": {
        try {
          const { compoundId } = await deleteRiskAssessmentById(session, id)
          //Delete associated compound, as currently a one-to-one relationship
          await deleteCompoundById(session, compoundId)
        } catch (error) {
          console.error(error)

          if (error instanceof ForbiddenError) {
            return sendForbiddenError(res, error)
          }

          // Unable to delete due to existing reference
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
          ) {
            return sendJsonError(
              res,
              409,
              "Unable to delete due to risk assessment being referenced by other records (i.e., MFRs).",
            )
          }

          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(200).send(`Risk assessment ${id} deleted.`)
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

export const updateRiskAssessmentById = async (
  session: AppSession,
  id: number,
  data: Prisma.RiskAssessmentUpdateArgs["data"],
) => {
  return await getUserPrismaClient(session.appUser).riskAssessment.update({
    where: {
      id,
    },
    include: {
      compound: compoundWithIngredients,
    },
    data,
  })
}

export const getRiskAssessmentById = async (
  session: AppSession,
  id: number,
) => {
  return await getUserPrismaClient(session.appUser).riskAssessment.findUnique({
    where: {
      id,
    },
    include: {
      compound: compoundWithIngredients,
    },
  })
}

export const deleteRiskAssessmentById = async (
  session: AppSession,
  id: number,
) =>
  getUserPrismaClient(session.appUser).riskAssessment.delete({
    where: { id },
  })
