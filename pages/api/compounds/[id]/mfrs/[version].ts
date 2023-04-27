import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import { fromZodError } from "zod-validation-error"

import { sendJsonError, sendZodError } from "lib/api/utils"
import { MfrFields, mfrSchema } from "lib/fields"
import MfrMapper from "lib/mappers/MfrMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { MfrAll, mfrAll } from "types/models"

const querySchema = z.object({
  compoundId: z.string().pipe(z.coerce.number()),
  version: z.string().pipe(z.coerce.number()),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<MfrAll | undefined>>,
) {
  const { method } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success) {
    return sendZodError(res, results.error)
  }

  const { compoundId, version } = results.data

  switch (method) {
    case "GET": {
      let mfr
      try {
        mfr = await getMfr(compoundId, version)
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
        updatedMfr = await updateMfr(compoundId, version, data)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(updatedMfr)
    }
    case "DELETE": {
      try {
        await deleteMfr(compoundId, version)
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
}

export const getMfr = async (compoundId: number, version: number) =>
  await prisma.mfr.findUnique({
    where: { compoundId_version: { compoundId, version } },
    ...mfrAll,
  })

export const updateMfr = async (
  compoundId: number,
  version: number,
  values: MfrFields,
) =>
  await prisma.mfr.update({
    where: { compoundId_version: { compoundId, version } },
    data: MfrMapper.toModel({ version, ...values }),
    ...mfrAll,
  })

export const deleteMfr = async (compoundId: number, version: number) =>
  await prisma.mfr.delete({
    where: { compoundId_version: { compoundId, version } },
  })
