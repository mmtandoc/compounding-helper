import { ForbiddenError } from "@casl/ability"
import { Prisma } from "@prisma/client"
import { z } from "zod"

import {
  AppSession,
  sendForbiddenError,
  sendJsonError,
  sendZodError,
  withSession,
} from "lib/api/utils"
import { mfrSchema } from "lib/fields"
import MfrMapper from "lib/mappers/MfrMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { MfrAll, mfrAll as includeAllNested } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<MfrAll[] | MfrAll>>(async (req, res) => {
  const { method, session } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success) {
    return sendZodError(res, results.error, 400, { prefix: "Invalid ID" })
  }

  const compoundId = results.data.id

  switch (method) {
    case "GET": {
      let mfrs: MfrAll[]

      try {
        mfrs = await getMfrsByCompoundId(session, compoundId)
      } catch (error) {
        console.error(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(mfrs)
    }
    case "POST": {
      let fields
      try {
        fields = mfrSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      const latestVersion = await getLatestMfrVersion(session, compoundId)

      const nextVersion = latestVersion ? latestVersion + 1 : 0

      try {
        const result = await getUserPrismaClient(session.appUser).mfr.create({
          ...includeAllNested,
          data: MfrMapper.toModel({
            version: nextVersion,
            ...fields,
          }),
        })
        res
          .setHeader(
            "Location",
            `/compounds/${result.compoundId}/mfrs/${result.version}`,
          )
          .status(201)
          .json(result)
      } catch (error) {
        console.error(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
      }

      return
    }
    default:
      return sendJsonError(
        res.setHeader("Allow", ["GET", "POST"]),
        405,
        `Method ${method} Not Allowed`,
      )
  }
})

export default handler

export const getMfrs = async (
  session: AppSession,
  args?: Omit<Prisma.MfrFindManyArgs, "select" | "include">,
) => {
  const defaultArgs: Omit<Prisma.MfrFindManyArgs, "select" | "include"> = {
    orderBy: [{ riskAssessment: { compoundId: "asc" } }, { version: "asc" }],
  }
  return await getUserPrismaClient(session.appUser).mfr.findMany({
    ...defaultArgs,
    ...args,
    ...includeAllNested,
  })
}

export const getMfrsByCompoundId = async (
  session: AppSession,
  compoundId: number,
) =>
  getMfrs(session, {
    where: {
      riskAssessment: {
        compoundId: {
          equals: compoundId,
        },
      },
    },
  })

export const getLatestMfrVersion = async (
  session: AppSession,
  compoundId: number,
) =>
  (
    await getUserPrismaClient(session.appUser).mfr.aggregate({
      where: { compoundId },
      _max: {
        version: true,
      },
    })
  )._max.version
