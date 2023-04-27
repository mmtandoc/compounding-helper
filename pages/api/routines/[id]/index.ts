import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

import { sendJsonError, sendZodError } from "lib/api/utils"
import { RoutineFields, routineSchema } from "lib/fields"
import RoutineMapper from "lib/mappers/RoutineMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { RoutineWithHistory, routineWithHistory } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<RoutineWithHistory | undefined>>,
) {
  const { method } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success) {
    return sendZodError(res, results.error)
  }

  const id = results.data.id

  switch (method) {
    case "GET": {
      let routine
      try {
        routine = await getRoutineById(id)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      if (routine === null) {
        return sendJsonError(res, 404, `Routine ${id} not found.`)
      }

      return res.status(200).json(routine)
    }
    case "PUT": {
      let data
      try {
        data = routineSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let updatedRoutine
      try {
        updatedRoutine = await updateRoutineById(id, data)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(updatedRoutine)
    }
    case "DELETE": {
      try {
        await deleteRoutineById(id)
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

export const getRoutineById = async (id: number) =>
  await prisma.routine.findUnique({
    where: { id },
    ...routineWithHistory,
  })

export const updateRoutineById = async (id: number, values: RoutineFields) =>
  await prisma.routine.update({
    where: { id },
    data: RoutineMapper.toModel(values),
    ...routineWithHistory,
  })

export const deleteRoutineById = async (id: number) =>
  await prisma.routine.delete({ where: { id } })
