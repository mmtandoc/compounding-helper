import { Prisma } from "@prisma/client"
import { z } from "zod"

import {
  AppSession,
  sendJsonError,
  sendZodError,
  withSession,
} from "lib/api/utils"
import { compoundSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import IngredientMapper from "lib/mappers/IngredientMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { CompoundWithIngredients } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<CompoundWithIngredients> | string>(
  async (req, res) => {
    const { body, method, session } = req

    const results = querySchema.safeParse(req.query)

    if (!results.success) {
      return sendZodError(res, results.error)
    }

    const id = results.data.id

    switch (method) {
      case "GET": {
        let compound
        try {
          compound = await getCompoundById(session, id)
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
          compound = await updateCompoundById(session, id, {
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
          await deleteCompoundById(session, id)
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
  },
)

export default handler

export const updateCompoundById = async (
  session: AppSession,
  id: number,
  data: Prisma.CompoundUpdateArgs["data"],
) => {
  return await getUserPrismaClient(session.appUser).compound.update({
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

export const getCompoundById = async (session: AppSession, id: number) => {
  return await getUserPrismaClient(session.appUser).compound.findUnique({
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

export const deleteCompoundById = async (session: AppSession, id: number) => {
  const client = getUserPrismaClient(session.appUser)

  return await client.$transaction([
    client.ingredient.deleteMany({ where: { compoundId: id } }),
    client.compound.delete({ where: { id } }),
  ])
}
