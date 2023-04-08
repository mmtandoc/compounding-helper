import { useMemo } from "react"
import useSWR from "swr"

import { RoutineWithHistory } from "types/models"

export const useRoutineCategories = () => {
  const { data, error, isLoading } =
    useSWR<RoutineWithHistory[]>("/api/routines")

  const categories = useMemo(
    () =>
      data
        ?.reduce(
          (arr, r) =>
            r.category && !arr.includes(r.category)
              ? [...arr, r.category]
              : arr,
          [] as string[],
        )
        .sort(),
    [data],
  )

  if (error) {
    console.error(error)
    return
  }

  if (isLoading) {
    return
  }

  return categories
}
