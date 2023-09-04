import useSWR from "swr"

import { JsonError } from "types/common"
import { UserWithPharmacy } from "types/models"

export const useCurrentUser = () => {
  const { data, error, isLoading } = useSWR<UserWithPharmacy, JsonError>(
    "/api/users/current",
  )

  return {
    user: data,
    isLoading,
    error: error,
  }
}
