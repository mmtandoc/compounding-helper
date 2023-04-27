import { NextApiRequest, NextApiResponse } from "next"
import * as z from "zod"

import { sendJsonError, sendZodError } from "lib/api/utils"
import { ChemicalFields, chemicalSchema } from "lib/fields"
import ChemicalMapper from "lib/mappers/ChemicalMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { ChemicalAll, chemicalAll } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<ChemicalAll | undefined>>,
) {
  const { method } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success) {
    return sendZodError(res, results.error)
  }

  const id = results.data.id

  switch (method) {
    case "GET": {
      let chemical
      try {
        chemical = await getChemicalById(id)
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
        updatedChemical = await updateChemicalById(id, data)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(updatedChemical)
    }
    case "DELETE": {
      try {
        await deleteChemicalById(id)
      } catch (error) {
        console.error(error)
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
}

//test

export const getChemicalById = async (id: number) =>
  await prisma.chemical.findUnique({
    where: { id },
    ...chemicalAll,
  })

export const updateChemicalById = async (id: number, values: ChemicalFields) =>
  await prisma.chemical.update({
    where: { id },
    data: ChemicalMapper.toModel(values),
    ...chemicalAll,
  })

export const deleteChemicalById = async (id: number) =>
  await prisma.chemical.delete({ where: { id } })
