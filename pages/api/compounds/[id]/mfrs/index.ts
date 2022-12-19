import { Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import { mfrSchema } from "lib/fields"
import MfrMapper from "lib/mappers/MfrMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { MfrAll, mfrAll as includeAllNested } from "types/models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<MfrAll[] | MfrAll>>,
) {
  const { query, method } = req

  const compoundId = parseInt(query.id as string)

  switch (method) {
    case "GET": {
      let mfrs: MfrAll[]

      try {
        mfrs = await getMfrsByCompoundId(compoundId)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(mfrs)
      return
    }
    case "POST": {
      let fields
      try {
        fields = mfrSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        res.status(400).json({
          error: { code: 400, message: "Body is invalid." },
        })
        return
      }

      const nextVersion =
        (await prisma.mfr.count({ where: { compoundId } })) ?? 0

      const mfrData = MfrMapper.toModel({ version: nextVersion, ...fields })

      try {
        const result = await prisma.mfr.create({
          ...includeAllNested,
          data: {
            ...mfrData,
          },
        })
        res
          .setHeader(
            "Location",
            `/compounds/${result.compoundId}/mfrs/${result.version}`,
          )
          .status(201)
          .json(result)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
      }

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

export const getMfrs = async (
  args?: Omit<Prisma.MfrFindManyArgs, "select" | "include">,
) => {
  const defaultArgs: Omit<Prisma.MfrFindManyArgs, "select" | "include"> = {
    orderBy: [{ riskAssessment: { compoundId: "asc" } }, { version: "asc" }],
  }
  return await prisma.mfr.findMany({
    ...defaultArgs,
    ...args,
    ...includeAllNested,
  })
}

export const getMfrsByCompoundId = async (compoundId: number) =>
  getMfrs({
    where: {
      riskAssessment: {
        compoundId: {
          equals: compoundId,
        },
      },
    },
  })
