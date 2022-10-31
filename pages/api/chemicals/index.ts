import { Chemical, Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import { ChemicalFields, chemicalSchema } from "lib/fields"
import ChemicalMapper from "lib/mappers/ChemicalMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<Chemical[] | Chemical>>,
) {
  const { query: queryValues, method } = req

  const queryString =
    queryValues.query === undefined
      ? undefined
      : typeof queryValues.query === "string"
      ? queryValues.query
      : queryValues.query?.[0]

  switch (method) {
    case "GET": {
      let chemicals

      try {
        chemicals = await getChemicals(queryString)
      } catch (error) {
        //TODO: HANDLE ERROR
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(chemicals)
      return
    }
    case "POST": {
      let data
      try {
        data = chemicalSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      let chemical
      try {
        chemical = await createChemical(data)
      } catch (error) {
        //TODO: HANDLE ERROR
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(chemical)
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
