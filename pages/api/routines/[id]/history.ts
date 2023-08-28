import { Prisma } from "@prisma/client"
import { User as AuthUser } from "@supabase/supabase-js"
import { z } from "zod"

import { sendJsonError, sendZodError, withSession } from "lib/api/utils"
import { completionSchema } from "lib/fields"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"

import { getRoutineById } from "."

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<undefined>>(async (req, res) => {
  const { method, session } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success) return sendZodError(res, results.error)

  const routineId = results.data.id

  switch (method) {
    case "PUT": {
      let data
      try {
        data = completionSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      try {
        const lastCompleted = (await getRoutineById(session.user, routineId))
          ?.completionHistory[0]?.date

        if (lastCompleted && lastCompleted > new Date(data.date)) {
          return sendJsonError(
            res,
            422,
            "Completion date must be after the routine was last completed.",
          )
        }

        await createRoutineCompletion(session.user, { routineId, ...data })
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(204).send(undefined)
    }
    default:
      return sendJsonError(
        res.setHeader("Allow", ["PUT"]),
        405,
        `Method ${method} Not Allowed`,
      )
  }
})

export default handler

export const createRoutineCompletion = async (
  currentUser: AuthUser,
  data: Prisma.RoutineCompletionUncheckedCreateInput,
) => getUserPrismaClient(currentUser).routineCompletion.create({ data })
