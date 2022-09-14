import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { RiskAssessmentAll } from "types/models"
import { Prisma } from "@prisma/client"
import { mapRiskAssessmentFieldsToUpdateData } from "lib/RiskAssessmentUtil"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<RiskAssessmentAll>>,
) {
  const {
    query: { id },
    body,
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
        riskAssessment = await getRiskAssessmentById(
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
    //TODO: Implement PUT
    case "PUT": {
      let riskAssessment
      try {
        riskAssessment = await updateRiskAssessmentById(
          parseInt(typeof id === "string" ? id : id[0]),
          mapRiskAssessmentFieldsToUpdateData(body),
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
    data,
  })
}

export const getRiskAssessmentById = async (id: number) => {
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

export const deleteRiskAssessmentById = async (id: number) => {
  return await prisma.$transaction([
    prisma.ingredient.deleteMany({ where: { riskAssessmentId: id } }),
    prisma.riskAssessment.delete({ where: { id } }),
  ])
}
