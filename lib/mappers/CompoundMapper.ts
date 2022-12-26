import { Prisma } from "@prisma/client"

import { CompoundFields, CompoundFieldsInput, compoundSchema } from "lib/fields"
import { CompoundWithIngredients } from "types/models"

import IngredientMapper from "./IngredientMapper"

const CompoundMapper = {
  toFieldValues: (data: CompoundWithIngredients): CompoundFields => {
    const values: CompoundFieldsInput = {
      id: data.id,
      name: data.name,
      ingredients: data.ingredients
        .map(IngredientMapper.toFieldValues)
        .sort((a, b) => a.order - b.order),
      hasMasterFormulationRecord: data.hasMasterFormulationRecord,
      notes: data.notes,
    }
    return compoundSchema.parse(values)
  },

  toModel: (
    values: CompoundFields,
  ): Omit<
    Prisma.CompoundUncheckedCreateInput,
    "ingredients" | "riskAssessments"
  > => {
    return {
      id: values.id ?? undefined,
      name: values.name,
      hasMasterFormulationRecord: values.hasMasterFormulationRecord,
      notes: values.notes,
    }
  },
}

export default CompoundMapper
