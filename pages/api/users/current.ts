import { sendJsonError, withSession } from "lib/api/utils"
import { ApiBody } from "types/common"
import { UserWithPharmacy } from "types/models"

const handler = withSession<ApiBody<UserWithPharmacy | null>>(
  async (req, res) => {
    const { method, session } = req

    switch (method) {
      case "GET": {
        return res.status(200).json(session?.appUser ?? null)
      }
      default:
        sendJsonError(
          res.setHeader("Allow", ["GET"]),
          405,
          `Method ${method} Not Allowed`,
        )
        break
    }
  },
  { requireAuth: false },
)

export default handler
