import useSWR from "swr"

import { JsonError } from "types/common"
import { UserWithPharmacy } from "types/models"

export const useCurrentUser = () => {
  const { data, ...response } = useSWR<UserWithPharmacy, JsonError>(
    "/api/users/current",
  )

  return {
    user: data,
    ...response,
  }
}
