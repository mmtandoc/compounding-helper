import { Prisma } from "@prisma/client"
import * as z from "zod"

import {
  AppSession,
  sendJsonError,
  sendZodError,
  withSession,
} from "lib/api/utils"
import { ChemicalFields, chemicalSchema } from "lib/fields"
import ChemicalMapper from "lib/mappers/ChemicalMapper"
import { getUserPrismaClient } from "lib/prisma"
import { isCentralPharmacy } from "lib/utils"
import { ApiBody } from "types/common"
import { ChemicalAll, chemicalAll } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<ChemicalAll | undefined>>(
  async (req, res) => {
    const { method, session } = req

    const results = querySchema.safeParse(req.query)

    if (!results.success) {
      return sendZodError(res, results.error)
    }

    const id = results.data.id

    switch (method) {
      case "GET": {
        let chemical
        try {
          chemical = await getChemicalById(session, id)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        if (chemical === null) {
          return sendJsonError(res, 404, `Chemical ${id} not found.`)
        }

        return res.status(200).json(chemical)
      }
      case "PUT": {
        let data
        try {
          data = chemicalSchema.parse(req.body)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 400, "Body is invalid.")
        }

        let updatedChemical
        try {
          updatedChemical = await updateChemicalById(session, id, data)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(200).json(updatedChemical)
      }
      case "DELETE": {
        try {
          await deleteChemicalById(session, id)
        } catch (error) {
          console.error(error)
          // Unable to delete due to existing reference
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
          ) {
            return sendJsonError(
              res,
              409,
              "Unable to delete due to chemical being referenced by other records (products).",
            )
          }

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
  },
)

export default handler

export const getChemicalById = async (session: AppSession, id: number) =>
  await getUserPrismaClient(session.authSession.user).chemical.findUnique({
    where: { id },
    ...chemicalAll,
  })

export const updateChemicalById = async (
  session: AppSession,
  chemicalId: number,
  values: ChemicalFields,
) => {
  const currentPharmacyId = session.appUser.pharmacyId

  const localAdditionalInfo = values.additionalInfo.filter(
    (v): v is { value: string; pharmacyId?: number } =>
      v.pharmacyId === undefined || v.pharmacyId === currentPharmacyId,
  )

  return await getUserPrismaClient(session.authSession.user).$transaction(
    async (tx) => {
      /*
      If the updated chemical data has no additional info owned by current user's pharmacy,
      then we should delete their current additional info if it exists
      */
      if (!localAdditionalInfo.length) {
        try {
          await tx.additionalChemicalInfo.delete({
            where: {
              chemicalId_pharmacyId: {
                chemicalId,
                pharmacyId: currentPharmacyId,
              },
            },
          })
        } catch (error) {
          // Catch error thrown if records doesn't exist (https://github.com/prisma/prisma/issues/4072)
        }
      }

      // If owned by central, and current user doesn't belong to central pharmacy, only update additionalChemicalInfo
      if (
        !isCentralPharmacy(currentPharmacyId) &&
        isCentralPharmacy(values.pharmacyId ?? currentPharmacyId)
      ) {
        for (const val of localAdditionalInfo) {
          await tx.additionalChemicalInfo.upsert({
            where: {
              chemicalId_pharmacyId: {
                chemicalId,
                pharmacyId: val.pharmacyId ?? currentPharmacyId,
              },
            },
            create: { value: val.value, chemicalId },
            update: { value: val.value },
          })
        }

        return await tx.chemical.findUniqueOrThrow({
          where: { id: chemicalId },
          ...chemicalAll,
        })
      }

      return await tx.chemical.update({
        where: { id: chemicalId },
        data: {
          ...ChemicalMapper.toModel(values),
          additionalInfo: {
            upsert: localAdditionalInfo.map((val) => ({
              where: {
                chemicalId_pharmacyId: {
                  chemicalId,
                  pharmacyId: val.pharmacyId ?? currentPharmacyId,
                },
              },
              create: { value: val.value },
              update: { value: val.value },
            })),
          },
        },
        ...chemicalAll,
      })
    },
  )
}

export const deleteChemicalById = async (session: AppSession, id: number) =>
  await getUserPrismaClient(session.authSession.user).chemical.delete({
    where: { id },
  })
