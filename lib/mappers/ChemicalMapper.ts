import { Chemical } from "@prisma/client"
import { SetOptional } from "type-fest"
import { ChemicalFields } from "types/fields"
import { ChemicalAll } from "types/models"

const toFieldValues = (data: ChemicalAll): ChemicalFields => {
  return {
    id: data.id,
    name: data.name,
    casNumber: data.casNumber,
    nioshTable: data.nioshTable as -1 | 1 | 2 | 3,
    synonyms: data.synonyms,
  }
}

const toModel = (
  values: ChemicalFields,
): SetOptional<Chemical, "id" | "updatedAt"> => {
  return {
    id: values.id ?? undefined,
    name: values.name,
    casNumber: values.casNumber,
    nioshTable: values.nioshTable,
    synonyms: values.synonyms,
    nioshRevisionDate: values.nioshRevisionDate
      ? new Date(values.nioshRevisionDate)
      : null,
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { toFieldValues, toModel }
