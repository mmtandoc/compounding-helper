import { NextApiHandler } from "next"

import { getSession, sendJsonError, withSession } from "lib/api/utils"
import { ApiBody } from "types/common"
import { UserWithPharmacy } from "types/models"

const handler: NextApiHandler<ApiBody<UserWithPharmacy | undefined>> = async (
  req,
  res,
) => {
  const { method } = req

  switch (method) {
    case "GET": {
      const session = await getSession({ req, res })

      if (!session) return res.status(204).send(undefined)

      return res.status(200).json(session.appUser)
    }
    default:
      sendJsonError(
        res.setHeader("Allow", ["GET"]),
        405,
        `Method ${method} Not Allowed`,
      )
      break
  }
}

export default handler
