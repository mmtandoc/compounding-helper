import { ForbiddenError } from "@casl/ability"
import * as z from "zod"

import { getUser, updateUser } from "lib/api/users"
import {
  sendForbiddenError,
  sendJsonError,
  sendZodError,
  withSession,
} from "lib/api/utils"
import { userSchema } from "lib/fields"
import { ApiBody } from "types/common"
import { UserWithPharmacy } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
  userId: z.string().uuid(),
})

const handler = withSession<ApiBody<UserWithPharmacy>>(async (req, res) => {
  const { method, session } = req

  const queryResults = querySchema.safeParse(req.query)

  if (!queryResults.success) {
    return sendZodError(res, queryResults.error)
  }

  const { id: pharmacyId, userId } = queryResults.data

  switch (method) {
    case "GET": {
      let user
      try {
        user = await getUser(session, { pharmacyId, id: userId })
      } catch (error) {
        console.log(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      if (user === null) {
        return sendJsonError(res, 404, `User ${userId} not found.`)
      }

      return res.status(200).json(user)
    }
    case "PUT": {
      let data
      try {
        data = userSchema
          .required({ id: true, pharmacyId: true })
          .parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let updatedUser
      try {
        updatedUser = await updateUser(
          session,
          { id: userId, pharmacyId },
          data,
        )
      } catch (error) {
        console.error(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(updatedUser)
    }
    //TODO: Implement DELETE
    default:
      sendJsonError(
        res.setHeader("Allow", ["GET", "PUT" /* , "DELETE" */]),
        405,
        `Method ${method} Not Allowed`,
      )
      break
  }
})

export default handler
