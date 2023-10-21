import useSWR, { SWRConfiguration } from "swr"

import { JsonError } from "types/common"
import { UserWithPharmacy } from "types/models"

export const useCurrentUser = (options?: SWRConfiguration) => {
  const { data, ...response } = useSWR<UserWithPharmacy | null, JsonError>(
    "/api/users/current",
    null,
    options,
  )

  return {
    user: data,
    ...response,
  }
}
