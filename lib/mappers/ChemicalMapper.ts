import { Prisma } from "@prisma/client"
import { chemicalSchema, ChemicalFields } from "lib/fields"
import { ChemicalAll } from "types/models"

const toFieldValues = (data: ChemicalAll): ChemicalFields => {
  return chemicalSchema.parse({
    id: data.id,
    name: data.name,
    casNumber: data.casNumber,
    hasNoCasNumber: data.casNumber === null,
    nioshTable: data.nioshTable as -1 | 1 | 2 | 3,
    synonyms: data.synonyms,
    nioshRevisionDate:
      data.nioshRevisionDate?.toLocaleDateString("en-CA") ?? null,
  })
}

const toModel = (
  values: ChemicalFields,
): Prisma.ChemicalUncheckedCreateInput => {
  return {
    id: values.id ?? undefined,
    name: values.name,
    casNumber: values.casNumber,
    nioshTable: values.nioshTable,
    synonyms: values?.synonyms ?? [],
    nioshRevisionDate: values.nioshRevisionDate
      ? new Date(values.nioshRevisionDate)
      : null,
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { toFieldValues, toModel }
