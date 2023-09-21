import * as z from "zod"

import {
  AppSession,
  sendJsonError,
  sendZodError,
  withSession,
} from "lib/api/utils"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { PharmacyWithUsers, pharmacyWithUsers } from "types/models"

const querySchema = z.object({
  id: z.coerce.number().int(),
})

const handler = withSession<ApiBody<PharmacyWithUsers | undefined>>(
  async (req, res) => {
    const { method, session } = req

    const results = querySchema.safeParse(req.query)

    if (!results.success) {
      return sendZodError(res, results.error, 400, { prefix: "Invalid ID" })
    }

    const id = results.data.id

    switch (method) {
      case "GET": {
        let pharmacy
        try {
          pharmacy = await getPharmacyById(session, id)
        } catch (error) {
          console.log(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        if (pharmacy === null) {
          return sendJsonError(res, 404, `Pharmacy ${id} not found.`)
        }

        return res.status(200).json(pharmacy)
      }
      // TODO: Implement PUT method
      // TODO: Implement DELETE method?
      default:
        sendJsonError(
          res.setHeader("Allow", ["GET"]),
          405,
          `Method ${method} Not Allowed`,
        )
        break
    }
  },
)

export default handler

export const getPharmacyById = async (session: AppSession, id: number) =>
  getUserPrismaClient(session.authSession.user).pharmacy.findUnique({
    where: { id },
    ...pharmacyWithUsers,
  })
