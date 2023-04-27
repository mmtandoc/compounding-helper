import { Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import {
  PrismaOrderByWithoutRelationInput,
  parseSortQuery,
  sendJsonError,
} from "lib/api/utils"
import { RoutineFields, routineSchema } from "lib/fields"
import RoutineMapper from "lib/mappers/RoutineMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { RoutineWithHistory, routineWithHistory } from "types/models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<RoutineWithHistory[] | RoutineWithHistory>>,
) {
  const { method } = req

  //TODO: Validate that column name is valid

  let orderBy: Prisma.RoutineOrderByWithRelationInput[] | undefined

  try {
    orderBy = parseSortQuery<Prisma.RoutineOrderByWithRelationInput>(req.query)
  } catch (error) {
    console.log(error)
    return sendJsonError(res, 400, "Invalid sort parameter.")
  }

  switch (method) {
    case "GET": {
      let routines: RoutineWithHistory[]

      try {
        routines = await getRoutines({ orderBy })
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
        result = await createRoutine(fields)
      } catch (error) {
        //TODO: HANDLE ERROR
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
}

export const getRoutines = async (
  args?: Omit<Prisma.RoutineFindManyArgs, "select" | "include">,
) => {
  const defaultArgs: Omit<Prisma.RoutineFindManyArgs, "select" | "include"> = {
    orderBy: { id: "asc" },
  }

  return await prisma.routine.findMany({
    ...defaultArgs,
    ...args,
    ...routineWithHistory,
  })
}

export const createRoutine = async (values: RoutineFields) =>
  await prisma.routine.create({
    data: RoutineMapper.toModel(values),
    ...routineWithHistory,
  })
