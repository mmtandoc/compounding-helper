import { ForbiddenError } from "@casl/ability"
import { User } from "@prisma/client"
import { AuthApiError } from "@supabase/supabase-js"

import { getProfile, updateProfile } from "lib/api/profile"
import {
  sendForbiddenError,
  sendJsonError,
  sendSupabaseAuthApiError,
  withSession,
} from "lib/api/utils"
import { profileSchema } from "lib/fields"
import { UserWithPharmacy } from "types/models"

const handler = withSession<UserWithPharmacy[] | User>(async (req, res) => {
  const { method, session } = req

  switch (method) {
    case "GET": {
      let profile
      try {
        profile = await getProfile(session)
      } catch (error) {
        console.log(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      if (profile === null) {
        return sendJsonError(res, 404, "Profile not found.")
      }

      return res.status(200).json(profile)
    }
    case "PUT": {
      // TODO: Allow user to change their own password?

      let data
      try {
        data = profileSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let updatedProfile
      try {
        updatedProfile = await updateProfile(session, data)
      } catch (error) {
        console.error(error)

        if (error instanceof AuthApiError) {
          return sendSupabaseAuthApiError(res, error)
        }

        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }

        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(updatedProfile)
    }
    default:
      sendJsonError(
        res.setHeader("Allow", ["GET", "PUT"]),
        405,
        `Method ${method} Not Allowed`,
      )
      break
  }
})

export default handler
