import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { riskAssessmentAll } from "types/models"
import IngredientMapper from "lib/mappers/IngredientMapper"
import RiskAssessmentMapper from "lib/mappers/RiskAssessmentMapper"
import { RiskAssessmentFields } from "types/fields"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
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
      if (query.debug !== undefined) {
        res.status(200).send({ success: true })
        return
      }

      const fields: RiskAssessmentFields = req.body

      const result = await prisma.riskAssessment.create({
        include: {
          ingredients: true,
        },
        data: {
          ingredients: {
            createMany: {
              data: fields.ingredients.map(IngredientMapper.toModel),
            },
          },
          ...RiskAssessmentMapper.toModel(fields),
        },
      })
      res.status(200).json({ success: true, content: result })
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
    ...riskAssessmentAll,
  })
}
