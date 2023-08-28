import { User as AuthUser } from "@supabase/supabase-js"
import { z } from "zod"

import { sendJsonError, sendZodError, withSession } from "lib/api/utils"
import { RoutineFields, routineSchema } from "lib/fields"
import RoutineMapper from "lib/mappers/RoutineMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { RoutineWithHistory, routineWithHistory } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<RoutineWithHistory | undefined>>(
  async (req, res) => {
    const { method, session } = req

    const results = querySchema.safeParse(req.query)

    if (!results.success) {
      return sendZodError(res, results.error)
    }

    const id = results.data.id

    switch (method) {
      case "GET": {
        let routine
        try {
          routine = await getRoutineById(session.user, id)
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
          updatedRoutine = await updateRoutineById(session.user, id, data)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(200).json(updatedRoutine)
      }
      case "DELETE": {
        try {
          await deleteRoutineById(session.user, id)
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
  },
)

export default handler

export const getRoutineById = async (currentUser: AuthUser, id: number) =>
  await getUserPrismaClient(currentUser).routine.findUnique({
    where: { id },
    ...routineWithHistory,
  })

export const updateRoutineById = async (
  currentUser: AuthUser,
  id: number,
  values: RoutineFields,
) =>
  await getUserPrismaClient(currentUser).routine.update({
    where: { id },
    data: RoutineMapper.toModel(values),
    ...routineWithHistory,
  })

export const deleteRoutineById = async (currentUser: AuthUser, id: number) =>
  await getUserPrismaClient(currentUser).routine.delete({ where: { id } })
