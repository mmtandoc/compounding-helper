import { Prisma } from "@prisma/client"
import type { NextApiHandler } from "next"
import { z } from "zod"

import { sendJsonError, sendZodError } from "lib/api/utils"
import { completionSchema } from "lib/fields"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"

import { getRoutineById } from "."

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler: NextApiHandler<ApiBody<undefined>> = async (req, res) => {
  const { method } = req

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
        const lastCompleted = (await getRoutineById(routineId))
          ?.completionHistory[0]?.date

        if (lastCompleted && lastCompleted > new Date(data.date)) {
          return sendJsonError(
            res,
            422,
            "Completion date must be after the routine was last completed.",
          )
        }

        await createRoutineCompletion({ routineId, ...data })
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
}

export default handler

export const createRoutineCompletion = async (
  data: Prisma.RoutineCompletionUncheckedCreateInput,
) => prisma.routineCompletion.create({ data })
