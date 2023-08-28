import { User as AuthUser } from "@supabase/supabase-js"
import { z } from "zod"

import { sendJsonError, sendZodError, withSession } from "lib/api/utils"
import { MfrFields, mfrSchema } from "lib/fields"
import MfrMapper from "lib/mappers/MfrMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { MfrAll, mfrAll } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
  version: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<MfrAll | undefined>>(async (req, res) => {
  const { method, session } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success) {
    return sendZodError(res, results.error)
  }

  const { id: compoundId, version } = results.data

  switch (method) {
    case "GET": {
      let mfr
      try {
        mfr = await getMfr(session.user, compoundId, version)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      if (mfr === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `MFR ${compoundId}-${version} not found.`,
          },
        })
        return
      }

      res
        .setHeader("Location", `/compounds/${compoundId}/mfrs/${version}`)
        .status(201)
        .json(mfr)
      return
    }
    case "PUT": {
      let data
      try {
        data = mfrSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let updatedMfr
      try {
        updatedMfr = await updateMfr(session.user, compoundId, version, data)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(updatedMfr)
    }
    case "DELETE": {
      try {
        await deleteMfr(session.user, compoundId, version)
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
})

export default handler

export const getMfr = async (
  currentUser: AuthUser,
  compoundId: number,
  version: number,
) =>
  await getUserPrismaClient(currentUser).mfr.findUnique({
    where: { compoundId_version: { compoundId, version } },
    ...mfrAll,
  })

export const updateMfr = async (
  currentUser: AuthUser,
  compoundId: number,
  version: number,
  values: MfrFields,
) =>
  await getUserPrismaClient(currentUser).mfr.update({
    where: { compoundId_version: { compoundId, version } },
    data: MfrMapper.toModel({ version, ...values }),
    ...mfrAll,
  })

export const deleteMfr = async (
  currentUser: AuthUser,
  compoundId: number,
  version: number,
) =>
  await getUserPrismaClient(currentUser).mfr.delete({
    where: { compoundId_version: { compoundId, version } },
  })
