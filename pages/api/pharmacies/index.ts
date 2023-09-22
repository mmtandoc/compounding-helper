import { Pharmacy, Prisma } from "@prisma/client"

import { AppSession, sendJsonError, withSession } from "lib/api/utils"
import { getUserPrismaClient } from "lib/prisma"

const handler = withSession<Pharmacy[]>(async (req, res) => {
  const { method, session } = req

  switch (method) {
    case "GET": {
      let pharmacies

      try {
        pharmacies = await getPharmacies(session)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(pharmacies)
    }
    default:
      sendJsonError(
        res.setHeader("Allow", ["GET"]),
        405,
        `Method ${method} Not Allowed`,
      )
      break
  }
})

export default handler

export const getPharmacies = async (
  session: AppSession,
  where?: Prisma.PharmacyWhereInput,
) =>
  await getUserPrismaClient(session.appUser).pharmacy.findMany({
    where,
    orderBy: { id: "asc" },
  })
