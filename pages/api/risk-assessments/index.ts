import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { mapRiskAssessmentFieldsToCreateData } from "lib/RiskAssessmentUtil"
import { riskAssessmentAll } from "types/models"

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
      const result = await prisma.riskAssessment.create({
        include: {
          ingredients: true,
        },
        data: mapRiskAssessmentFieldsToCreateData(req.body),
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
