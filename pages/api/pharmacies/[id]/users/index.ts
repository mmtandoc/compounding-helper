import { ForbiddenError } from "@casl/ability"
import { User } from "@prisma/client"
import { AuthApiError } from "@supabase/supabase-js"
import * as z from "zod"

import { createUser, getUsers } from "lib/api/users"
import {
  sendForbiddenError,
  sendJsonError,
  sendSupabaseAuthApiError,
  sendZodError,
  withSession,
} from "lib/api/utils"
import { userSchema } from "lib/fields"
import { UserWithPharmacy } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<UserWithPharmacy[] | User>(async (req, res) => {
  const { method, session } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success) {
    return sendZodError(res, results.error, 400, { prefix: "Invalid ID" })
  }

  const pharmacyId = results.data.id

  switch (method) {
    case "GET": {
      let users

      try {
        users = await getUsers(session, { where: { pharmacyId } })
      } catch (error) {
        console.error(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(users)
    }
    case "POST": {
      let fields
      try {
        fields = userSchema.required({ password: true }).parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let result
      try {
        result = await createUser(session, {
          pharmacyId: session.appUser.pharmacyId, // pharmacyId can't be undefined for checking permissions,
          ...fields,
        })
      } catch (error) {
        console.error(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }

        if (error instanceof AuthApiError) {
          return sendSupabaseAuthApiError(res, error)
        }
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res
        .setHeader("Location", `/products/${result.id}`)
        .status(201)
        .json(result)
    }
    default:
      sendJsonError(
        res.setHeader("Allow", ["GET", "POST"]),
        405,
        `Method ${method} Not Allowed`,
      )
      break
  }
})

export default handler
