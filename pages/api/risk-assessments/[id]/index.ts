import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { compoundWithIngredients, RiskAssessmentAll } from "types/models"
import { Prisma } from "@prisma/client"
import IngredientMapper from "lib/mappers/IngredientMapper"
import RiskAssessmentMapper from "lib/mappers/RiskAssessmentMapper"
import { riskAssessmentSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import _ from "lodash"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<RiskAssessmentAll> | string>,
) {
  const { query, body, method } = req

  const id = parseInt(query.id as string)

  if (isNaN(id)) {
    res.status(500).json({
      error: { code: 400, message: "Risk assessment ID must be integer." },
    })
    return
  }

  switch (method) {
    case "GET": {
      let riskAssessment
      try {
        riskAssessment = await getRiskAssessmentById(id)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      if (riskAssessment === null) {
        res.status(500).json({
          error: { code: 404, message: `Risk assessment ${id} not found.` },
        })
        return
      }

      res.status(200).json(riskAssessment)
      return
    }
    case "PUT": {
      let fields
      try {
        fields = riskAssessmentSchema.parse(body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      const compound = CompoundMapper.toModel(fields.compound)
      const ingredients = fields.compound.ingredients.map(
        IngredientMapper.toModel,
      )

      let riskAssessment
      try {
        riskAssessment = await updateRiskAssessmentById(id, {
          ..._.omit(RiskAssessmentMapper.toModel(fields), "id", "compoundId"),
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
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      if (riskAssessment === null) {
        res.status(500).json({
          error: { code: 404, message: `Risk assessment ${id} not found.` },
        })
        return
      }

      res.status(200).json(riskAssessment)
      return
    }
    case "DELETE": {
      try {
        await deleteRiskAssessmentById(id)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).send(`Risk assessment ${id} deleted.`)
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

export const updateRiskAssessmentById = async (
  id: number,
  data: Prisma.RiskAssessmentUpdateArgs["data"],
) => {
  return await prisma.riskAssessment.update({
    where: {
      id,
    },
    include: {
      compound: compoundWithIngredients,
    },
    data,
  })
}

export const getRiskAssessmentById = async (id: number) => {
  return await prisma.riskAssessment.findUnique({
    where: {
      id,
    },
    include: {
      compound: compoundWithIngredients,
    },
  })
}

export const deleteRiskAssessmentById = async (id: number) =>
  prisma.riskAssessment.delete({ where: { id } })
