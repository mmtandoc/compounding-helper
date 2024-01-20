import { ProfileFields } from "lib/fields"

import { getUser, updateUser } from "./users"
import { AppSession } from "./utils"

export const getProfile = (session: AppSession) =>
  getUser(session, { id: session.appUser.id })

export const updateProfile = (session: AppSession, values: ProfileFields) =>
  updateUser(
    session,
    { id: session.appUser.id },
    {
      id: session.appUser.id,
      pharmacyId: session.appUser.pharmacyId,
      ...values,
    },
  )
