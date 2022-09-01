import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { RiskAssessmentAll } from "types/models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<RiskAssessmentAll>>,
) {
  const {
    query: { id },
    method,
  } = req

  if (id === undefined) {
    res.status(404).json({
      error: { code: 404, message: "Missing required query parameter 'id'." },
    })
    return
  }

  switch (method) {
    case "GET": {
      let riskAssessment
      try {
        riskAssessment = await getRiskAssessment(
          parseInt(typeof id === "string" ? id : id[0]),
        )
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
    //TODO: Implement patch
    default:
      res
        .setHeader("Allow", ["GET"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
  }
}
export async function getRiskAssessment(id: number) {
  return await prisma.riskAssessment.findUnique({
    where: {
      id,
    },
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
}
