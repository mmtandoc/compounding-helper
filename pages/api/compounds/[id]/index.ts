import { Prisma } from "@prisma/client"
import { compoundSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import IngredientMapper from "lib/mappers/IngredientMapper"
import { prisma } from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { ApiBody } from "types/common"
import { CompoundWithIngredients } from "types/models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<CompoundWithIngredients> | string>,
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
      let compound
      try {
        compound = await getCompoundById(id)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      if (compound === null) {
        res.status(500).json({
          error: { code: 404, message: `Risk assessment ${id} not found.` },
        })
        return
      }

      res.status(200).json(compound)
      return
    }
    case "PUT": {
      let fields
      try {
        fields = compoundSchema.parse(body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
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
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      if (compound === null) {
        res.status(500).json({
          error: { code: 404, message: `Compound ${id} not found.` },
        })
        return
      }

      res.status(200).json(compound)
      return
    }
    case "DELETE": {
      try {
        await deleteCompoundById(id)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).send(`Compound ${id} deleted.`)
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
