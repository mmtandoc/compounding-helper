import { Chemical, Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import * as z from "zod"

import { sendJsonError } from "lib/api/utils"
import { ChemicalFields, chemicalSchema } from "lib/fields"
import ChemicalMapper from "lib/mappers/ChemicalMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"

const querySchema = z.object({
  query: z.string().optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<Chemical[] | Chemical>>,
) {
  const { method } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success)
    return res.status(400).json({
      error: {
        code: 400,
        message: `Invalid query: ${results.error.flatten().fieldErrors.query}`,
      },
    })

  const query = results.data.query

  switch (method) {
    case "GET": {
      let chemicals

      try {
        chemicals = await getChemicals(query)
      } catch (error) {
        console.log(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(chemicals)
    }
    case "POST": {
      let data
      try {
        data = chemicalSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let chemical
      try {
        chemical = await createChemical(data)
      } catch (error) {
        console.log(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      res
        .setHeader("Location", `/chemicals/${chemical.id}`)
        .status(201)
        .json(chemical)
      return
    }
    default:
      return sendJsonError(
        res.setHeader("Allow", ["GET", "POST"]),
        405,
        `Method ${method} Not Allowed`,
      )
  }
}

export async function getChemicals(nameQuery?: string) {
  const where =
    nameQuery !== undefined
      ? Prisma.sql`WHERE (
            0 < (
              SELECT COUNT(*) 
              FROM unnest(synonyms) AS synonym
              WHERE synonym ILIKE ${`${nameQuery?.replaceAll("*", "%")}%`}
            ) OR name ILIKE ${`${nameQuery?.replaceAll("*", "%")}%`}
          )`
      : Prisma.empty
  return await prisma.$queryRaw<Chemical[]>(
    Prisma.sql`SELECT * FROM public.chemicals ${where} ORDER BY id ASC;`,
  )
}

export const createChemical = async (values: ChemicalFields) =>
  await prisma.chemical.create({ data: ChemicalMapper.toModel(values) })
