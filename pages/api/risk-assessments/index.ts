import { Prisma } from "@prisma/client"
import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next"

import { sendJsonError } from "lib/api/utils"
import { riskAssessmentSchema } from "lib/fields"
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
import { updateCompoundById } from "../compounds/[id]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<RiskAssessmentAll[] | RiskAssessmentAll>>,
) {
  const { query, method } = req

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      const findManyArgs: Prisma.RiskAssessmentFindManyArgs = {
        orderBy: { id: "asc" },
      }

      if (query.compoundId) {
        findManyArgs.orderBy = [{ id: "asc" }, { dateAssessed: "desc" }]
        if (typeof query.compoundId === "string") {
          findManyArgs.where = {
            compoundId: {
              equals: parseInt(query.compoundId),
            },
            ...findManyArgs.where,
          }
        } else {
          findManyArgs.where = {
            compoundId: {
              in: query.compoundId.map((id) => parseInt(id)),
            },
            ...findManyArgs.where,
          }
        }
      }

      console.log(findManyArgs)

      let riskAssessments

      try {
        riskAssessments = await getRiskAssessments(findManyArgs)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(riskAssessments)
    }
    case "POST": {
      let fields
      try {
        fields = riskAssessmentSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
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
        console.error(error)
        sendJsonError(res, 500, "Encountered error with database.")
      }

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

export const getRiskAssessments = async (
  args?: Omit<Prisma.RiskAssessmentFindManyArgs, "select" | "include">,
) => {
  const defaultArgs: Omit<
    Prisma.RiskAssessmentFindManyArgs,
    "select" | "include"
  > = {
    orderBy: { id: "asc" },
  }
  return await prisma.riskAssessment.findMany({
    ...defaultArgs,
    ...args,
    ...includeAllNested,
  })
}
