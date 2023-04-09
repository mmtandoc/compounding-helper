import { Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import {
  PrismaOrderByWithoutRelationInput,
  parseSortQuery,
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
  let orderBy:
    | PrismaOrderByWithoutRelationInput<Prisma.RoutineOrderByWithRelationInput>[]
    | undefined

  try {
    orderBy = parseSortQuery<Prisma.RoutineOrderByWithRelationInput>(req.query)
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: { code: 400, message: "Invalid sort parameter." },
    })
    return
  }

  switch (method) {
    case "GET": {
      let routines: RoutineWithHistory[]

      try {
        routines = await getRoutines({ orderBy })
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(routines)
      return
    }
    case "POST": {
      let fields
      try {
        fields = routineSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      let result: RoutineWithHistory
      try {
        result = await createRoutine(fields)
      } catch (error) {
        //TODO: HANDLE ERROR
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res
        .setHeader("Location", `/routines/${result.id}`)
        .status(201)
        .json(result)
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
