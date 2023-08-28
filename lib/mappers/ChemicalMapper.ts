import { Prisma } from "@prisma/client"

import { ChemicalFields, chemicalSchema } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { ChemicalAll } from "types/models"

const toFieldValues = (data: ChemicalAll): ChemicalFields => {
  return chemicalSchema.parse({
    id: data.id,
    pharmacyId: data.pharmacyId,
    name: data.name,
    casNumber: data.casNumber,
    hasNoCasNumber: data.casNumber === null,
    nioshTable: data.nioshTable as -1 | 1 | 2 | 3,
    synonyms: data.synonyms,
    nioshRevisionDate: data.nioshRevisionDate
      ? toIsoDateString(data.nioshRevisionDate)
      : null,
    additionalInfo: data.additionalInfo,
  })
}

const toModel = (
  values: ChemicalFields,
): Prisma.ChemicalUncheckedCreateInput => {
  return {
    id: values.id ?? undefined,
    pharmacyId: values.pharmacyId,
    name: values.name,
    casNumber: values.casNumber,
    nioshTable: values.nioshTable,
    synonyms: values?.synonyms ?? [],
    nioshRevisionDate: values.nioshRevisionDate
      ? new Date(values.nioshRevisionDate)
      : null,
    additionalInfo: values.additionalInfo,
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { toFieldValues, toModel }
