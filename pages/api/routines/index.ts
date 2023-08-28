import { Prisma } from "@prisma/client"
import { User as AuthUser } from "@supabase/supabase-js"

import { parseSortQuery, sendJsonError, withSession } from "lib/api/utils"
import { RoutineFields, routineSchema } from "lib/fields"
import RoutineMapper from "lib/mappers/RoutineMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { RoutineWithHistory, routineWithHistory } from "types/models"

const handler = withSession<ApiBody<RoutineWithHistory[] | RoutineWithHistory>>(
  async (req, res) => {
    const { method, session } = req

    //TODO: Validate that column name is valid

    let orderBy: Prisma.RoutineOrderByWithRelationInput[] | undefined

    try {
      orderBy = parseSortQuery<Prisma.RoutineOrderByWithRelationInput>(
        req.query,
      )
    } catch (error) {
      console.log(error)
      return sendJsonError(res, 400, "Invalid sort parameter.")
    }

    switch (method) {
      case "GET": {
        let routines: RoutineWithHistory[]

        try {
          routines = await getRoutines(session.user, { orderBy })
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(200).json(routines)
      }
      case "POST": {
        let fields
        try {
          fields = routineSchema.parse(req.body)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 400, "Body is invalid.")
        }

        let result: RoutineWithHistory
        try {
          result = await createRoutine(session.user, fields)
        } catch (error) {
          console.log(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        res
          .setHeader("Location", `/routines/${result.id}`)
          .status(201)
          .json(result)
        return
      }
      default:
        return sendJsonError(
          res.setHeader("Allow", ["GET", "POST"]),
          405,
          `Method ${method} Not Allowed`,
        )
    }
  },
)

export default handler

export const getRoutines = async (
  currentUser: AuthUser,
  args?: Omit<Prisma.RoutineFindManyArgs, "select" | "include">,
) => {
  const defaultArgs: Omit<Prisma.RoutineFindManyArgs, "select" | "include"> = {
    orderBy: { id: "asc" },
  }

  return await getUserPrismaClient(currentUser).routine.findMany({
    ...defaultArgs,
    ...args,
    ...routineWithHistory,
  })
}

export const createRoutine = async (
  currentUser: AuthUser,
  values: RoutineFields,
) =>
  await getUserPrismaClient(currentUser).routine.create({
    data: RoutineMapper.toModel(values),
    ...routineWithHistory,
  })
