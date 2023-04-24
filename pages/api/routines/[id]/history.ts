import { Prisma, RoutineCompletion } from "@prisma/client"
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

import { completionSchema, routineSchema } from "lib/fields"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"

import { getRoutineById } from "."

const handler: NextApiHandler<ApiBody<undefined>> = async (req, res) => {
  const { query, method } = req

  const routineId = parseInt(query.id as string)

  if (isNaN(routineId)) {
    res.status(500).json({
      error: { code: 400, message: "Routine ID must be an integer." },
    })
    return
  }

  switch (method) {
    case "PUT": {
      let data
      try {
        data = completionSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      try {
        const lastCompleted = (await getRoutineById(routineId))
          ?.completionHistory[0]?.date

        if (lastCompleted && lastCompleted > new Date(data.date)) {
          res.status(422).json({
            error: {
              code: 422,
              message:
                "Completion date must be after the routine was last completed.",
            },
          })
          return
        }

        await createRoutineCompletion({ routineId, ...data })
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
        .setHeader("Allow", ["PUT"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
  }
}

export default handler

export const createRoutineCompletion = async (
  data: Prisma.RoutineCompletionUncheckedCreateInput,
) => prisma.routineCompletion.create({ data })
