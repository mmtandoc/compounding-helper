import { NextApiRequest, NextApiResponse } from "next"

import { RoutineFields, routineSchema } from "lib/fields"
import RoutineMapper from "lib/mappers/RoutineMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { RoutineWithHistory, routineWithHistory } from "types/models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<RoutineWithHistory | undefined>>,
) {
  const { query, method } = req

  const id = parseInt(query.id as string)

  if (isNaN(id)) {
    res.status(500).json({
      error: { code: 400, message: "Routine ID must be an integer." },
    })
    return
  }

  switch (method) {
    case "GET": {
      let routine
      try {
        routine = await getRoutineById(id)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      if (routine === null) {
        res.status(500).json({
          error: { code: 404, message: `Routine ${id} not found.` },
        })
        return
      }

      res.status(200).json(routine)
      return
    }
    case "PUT": {
      let data
      try {
        data = routineSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      let updatedRoutine
      try {
        updatedRoutine = await updateRoutineById(id, data)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(updatedRoutine)
      return
    }
    case "DELETE": {
      try {
        await deleteRoutineById(id)
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
