import { Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

import { sendJsonError, sendZodError } from "lib/api/utils"
import { compoundSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import IngredientMapper from "lib/mappers/IngredientMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { CompoundWithIngredients } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<CompoundWithIngredients> | string>,
) {
  const { body, method } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success) {
    return sendZodError(res, results.error)
  }

  const id = results.data.id

  switch (method) {
    case "GET": {
      let compound
      try {
        compound = await getCompoundById(id)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      if (compound === null) {
        return sendJsonError(res, 404, `Compound ${id} not found.`)
      }

      return res.status(200).json(compound)
    }
    case "PUT": {
      let fields
      try {
        fields = compoundSchema.parse(body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      const ingredients = fields.ingredients.map(IngredientMapper.toModel)

      let compound
      try {
        compound = await updateCompoundById(id, {
          ingredients: {
            deleteMany: {},
            createMany: {
              data: ingredients,
            },
          },
          ...CompoundMapper.toModel(fields),
        })
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      if (compound === null) {
        return sendJsonError(res, 404, `Compound ${id} not found.`)
      }

      return res.status(200).json(compound)
    }
    case "DELETE": {
      try {
        await deleteCompoundById(id)
      } catch (error) {
        console.error(error)
        // Unable to delete due to existing reference
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2003"
        ) {
          return sendJsonError(
            res,
            409,
            "Unable to delete due to compound being referenced by other records (i.e. MFR/Risk assessment).",
          )
        }

        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).send(`Compound ${id} deleted.`)
    }
    default:
      return sendJsonError(
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]),
        405,
        `Method ${method} Not Allowed`,
      )
  }
}

export const updateCompoundById = async (
  id: number,
  data: Prisma.CompoundUpdateArgs["data"],
) => {
  return await prisma.compound.update({
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

export const getCompoundById = async (id: number) => {
  return await prisma.compound.findUnique({
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

export const deleteCompoundById = async (id: number) => {
  return await prisma.$transaction([
    prisma.ingredient.deleteMany({ where: { compoundId: id } }),
    prisma.compound.delete({ where: { id } }),
  ])
}
