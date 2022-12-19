import { NextApiRequest, NextApiResponse } from "next"

import { MfrFields, mfrSchema } from "lib/fields"
import MfrMapper from "lib/mappers/MfrMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { MfrAll, mfrAll } from "types/models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<MfrAll | undefined>>,
) {
  const { query, method } = req

  const compoundId = parseInt(query.id as string)
  const version = parseInt(query.version as string)

  if (isNaN(compoundId)) {
    res.status(500).json({
      error: { code: 500, message: "Compound ID must be an integer." },
    })
    return
  }

  if (isNaN(version)) {
    res.status(500).json({
      error: { code: 500, message: "MFR version must be an integer." },
    })
    return
  }

  switch (method) {
    case "GET": {
      let mfr
      try {
        mfr = await getMfr(compoundId, version)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
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
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      let updatedMfr
      try {
        updatedMfr = await updateMfr(compoundId, version, data)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(updatedMfr)
      return
    }
    case "DELETE": {
      try {
        await deleteMfr(compoundId, version)
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
        .setHeader("Allow", ["GET", "PUT", "DELETE"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
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
