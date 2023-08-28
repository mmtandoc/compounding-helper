import { Prisma } from "@prisma/client"
import { User as AuthUser } from "@supabase/supabase-js"
import * as z from "zod"

import { sendJsonError, sendZodError, withSession } from "lib/api/utils"
import { ChemicalFields, chemicalSchema } from "lib/fields"
import ChemicalMapper from "lib/mappers/ChemicalMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { ChemicalAll, chemicalAll } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<ChemicalAll | undefined>>(
  async (req, res) => {
    const { method, session } = req

    const results = querySchema.safeParse(req.query)

    if (!results.success) {
      return sendZodError(res, results.error)
    }

    const id = results.data.id

    switch (method) {
      case "GET": {
        let chemical
        try {
          chemical = await getChemicalById(session.user, id)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        if (chemical === null) {
          return sendJsonError(res, 404, `Chemical ${id} not found.`)
        }

        return res.status(200).json(chemical)
      }
      case "PUT": {
        let data
        try {
          data = chemicalSchema.parse(req.body)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 400, "Body is invalid.")
        }

        let updatedChemical
        try {
          updatedChemical = await updateChemicalById(session.user, id, data)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(200).json(updatedChemical)
      }
      case "DELETE": {
        try {
          await deleteChemicalById(session.user, id)
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
              "Unable to delete due to chemical being referenced by other records (products).",
            )
          }

          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(204).send(undefined)
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

export const getChemicalById = async (user: AuthUser, id: number) =>
  await getUserPrismaClient(user).chemical.findUnique({
    where: { id },
    ...chemicalAll,
  })

export const updateChemicalById = async (
  user: AuthUser,
  id: number,
  values: ChemicalFields,
) =>
  await getUserPrismaClient(user).chemical.update({
    where: { id },
    data: ChemicalMapper.toModel(values),
    ...chemicalAll,
  })

export const deleteChemicalById = async (user: AuthUser, id: number) =>
  await getUserPrismaClient(user).chemical.delete({ where: { id } })
