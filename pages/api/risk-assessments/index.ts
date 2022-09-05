import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { mapRiskAssessmentFieldsToCreateData } from "lib/RiskAssessmentUtil"

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
        riskAssessments = await prisma.riskAssessment.findMany({
          orderBy: { id: "asc" },
          include: {
            ingredients: {
              include: {
                safetyDataSheet: {
                  include: {
                    product: {
                      include: {
                        chemical: true,
                        vendor: true,
                      },
                    },
                    healthHazards: {
                      include: {
                        hazardCategory: {
                          include: {
                            hazardClass: true,
                            parentCategory: true,
                            subcategories: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        })
      } catch (error) {
        //TODO: HANDLE ERROR
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
