import { Ingredient } from "@prisma/client"
import { SetOptional } from "type-fest"
import { IngredientFields } from "types/fields"
import { IngredientAll } from "types/models"

const toFieldValues = (ingredientData: IngredientAll): IngredientFields => {
  return {
    order: ingredientData.order,
    sdsId: ingredientData?.safetyDataSheetId ?? null,
    chemicalId: ingredientData?.safetyDataSheet?.product.chemicalId ?? null,
    productId: ingredientData?.safetyDataSheet?.productId ?? null,
    physicalForm: ingredientData.physicalForm,
    commercialProduct: {
      isCommercialProduct: !!ingredientData?.commercialProductName,
      din: ingredientData.commercialProductDin ?? null,
      name: ingredientData?.commercialProductName ?? null,
      hasNoDin:
        !!ingredientData?.commercialProductName &&
        !ingredientData?.commercialProductDin,
      hasProductMonographConcerns:
        ingredientData.hasProductMonographConcerns ?? null,
      concernsDescription: ingredientData.concernsDescription ?? null,
    },
  }
}

const toModel = (
  ingredient: IngredientFields,
): SetOptional<Ingredient, "riskAssessmentId"> => {
  const commercialProduct = ingredient?.commercialProduct
  return {
    order: ingredient.order,
    safetyDataSheetId: ingredient.sdsId,
    physicalForm: ingredient.physicalForm,
    commercialProductDin: commercialProduct?.din
      ? Number(commercialProduct.din)
      : null,
    commercialProductName: commercialProduct?.name ?? null,
    hasProductMonographConcerns:
      commercialProduct?.hasProductMonographConcerns ?? null,
    concernsDescription: commercialProduct?.concernsDescription ?? null,
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { toFieldValues, toModel }
