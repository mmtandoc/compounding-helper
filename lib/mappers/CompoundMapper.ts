import { Prisma } from "@prisma/client"

import { CompoundFields, compoundSchema } from "lib/fields"
import { CompoundWithIngredients } from "types/models"

import IngredientMapper from "./IngredientMapper"

const CompoundMapper = {
  toFieldValues: (data: CompoundWithIngredients): CompoundFields => {
    return compoundSchema.parse({
      id: data.id,
      pharmacyId: data.pharmacyId,
      name: data.name,
      ingredients: data.ingredients
        .map(IngredientMapper.toFieldValues)
        .sort((a, b) => a.order - b.order),
      shortcut: {
        hasShortcut: data.hasShortcut,
        variations: data.shortcutVariations,
        suffix: data.shortcutSuffix ?? undefined,
      },
      notes: data.notes,
    })
  },

  toModel: (
    values: CompoundFields,
  ): Omit<
    Prisma.CompoundUncheckedCreateInput,
    "ingredients" | "riskAssessments"
  > => {
    return {
      id: values.id,
      pharmacyId: values.pharmacyId,
      name: values.name,
      notes: values.notes,
      hasShortcut: values.shortcut?.hasShortcut,
      shortcutVariations: values.shortcut?.variations,
      shortcutSuffix: values.shortcut?.suffix,
    }
  },
}

export default CompoundMapper
