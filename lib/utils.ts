export const capitalize = (str: string, allWords = false): string => {
  const pattern = allWords ? /(\b[a-z](?!\s))/g : /(\b[a-z])/

  return str.replace(pattern, (s) => s.toUpperCase())
}

export const uncapitalize = <S extends string>(str: S): Uncapitalize<S> =>
  (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<S>

export const toIsoDateString = (date: Date) => date.toISOString().split("T")[0]

// To support potential modification in future
export const isCentralPharmacy = (pharmacyId: number) => pharmacyId === -1
