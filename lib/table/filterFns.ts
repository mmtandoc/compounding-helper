import { ChemicalAll, IngredientAll } from "types/models"

const filterFns = {
  string: (val: string, _: unknown, query: string) =>
    val?.toUpperCase().includes(query.toUpperCase()),
  ingredients: (
    ingredients: IngredientAll[],
    _: unknown,
    query: string,
  ): boolean => {
    return ingredients.some((ing) =>
      [
        ing.commercialProductName,
        ing.safetyDataSheet?.product.name,
        ing.safetyDataSheet?.product.chemical.name,
        ...(ing.safetyDataSheet?.product.chemical.synonyms ?? []),
      ].some((val) => val?.toUpperCase().includes(query.toUpperCase())),
    )
  },
}

export default filterFns
