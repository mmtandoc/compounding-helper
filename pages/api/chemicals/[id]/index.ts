import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { chemicalAll, ChemicalAll } from "types/models"
import { ApiBody } from "types/common"
import { ChemicalFields } from "types/fields"
import ChemicalMapper from "lib/mappers/ChemicalMapper"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<ChemicalAll | undefined>>,
) {
  const { query, method } = req

  const id = parseInt(query.id as string)

  if (isNaN(id)) {
    res.status(500).json({
      error: { code: 400, message: "Risk assessment ID must be integer." },
    })
    return
  }
  //TODO: Implement other User methods
  switch (method) {
    case "GET": {
      let chemical
      try {
        chemical = await getChemicalById(id)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      if (chemical === null) {
        res.status(500).json({
          error: { code: 404, message: `Chemical ${id} not found.` },
        })
        return
      }

      res.status(200).json(chemical)
      return
    }
    case "PUT": {
      let updatedChemical
      try {
        updatedChemical = await updateChemicalById(id, req.body)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(updatedChemical)
      return
    }
    case "DELETE": {
      try {
        await deleteChemicalById(id)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(204).send(undefined)
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
