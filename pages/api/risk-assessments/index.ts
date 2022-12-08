import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next"

import { RiskAssessmentFields, riskAssessmentSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import IngredientMapper from "lib/mappers/IngredientMapper"
import RiskAssessmentMapper from "lib/mappers/RiskAssessmentMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import {
  RiskAssessmentAll,
  riskAssessmentAll as includeAllNested,
} from "types/models"

import { createCompound } from "../compounds"
import { getCompoundById, updateCompoundById } from "../compounds/[id]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<RiskAssessmentAll[] | RiskAssessmentAll>>,
) {
  const { query, method } = req

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      let riskAssessments

      try {
        riskAssessments = await getRiskAssessments()
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(riskAssessments)
      return
    }
    case "POST": {
      let fields
      try {
        fields = riskAssessmentSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      const riskAssessmentData = RiskAssessmentMapper.toModel(fields)

      const compound = CompoundMapper.toModel(fields.compound)
      const ingredients = fields.compound.ingredients.map(
        IngredientMapper.toModel,
      )

      try {
        if (compound.id !== undefined) {
          updateCompoundById(compound.id, {
            ...compound,
            ingredients: { deleteMany: {}, createMany: { data: ingredients } },
          })
        } else {
          riskAssessmentData.compoundId = (
            await createCompound(fields.compound)
          ).id
        }
        const result = await prisma.riskAssessment.create({
          ...includeAllNested,
          data: {
            ..._.omit(riskAssessmentData, "id"),
            compoundId: riskAssessmentData.compoundId as number,
          },
        })
        res
          .setHeader("Location", `/risk-assessments/${result.id}`)
          .status(201)
          .json(result)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
      }

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

export const getRiskAssessments = async () => {
  return await prisma.riskAssessment.findMany({
    orderBy: { id: "asc" },
    ...includeAllNested,
  })
}
