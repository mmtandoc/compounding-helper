import { Ingredient, Prisma, RiskAssessment } from "@prisma/client"
import _ from "lodash"
import { SetOptional } from "type-fest"
import {
  IngredientFields,
  ExposureRisksFields,
  RiskAssessmentFields,
} from "types/fields"

export const mapIngredientsFieldToData = (
  ingredients: IngredientFields[],
): SetOptional<Ingredient, "riskAssessmentId" | "id">[] => {
  return ingredients.map((ingredient) => {
    return {
      id: ingredient.id ? ingredient.id : undefined,
      safetyDataSheetId: ingredient.sdsId,
      physicalForm: ingredient.physicalForm,
      commercialProductDin: ingredient?.commercialProduct?.din
        ? Number(ingredient.commercialProduct.din)
        : null,
      commercialProductName: ingredient?.commercialProduct?.name ?? null,
      hasProductMonographConcerns:
        ingredient.commercialProduct?.hasProductMonographConcerns ?? null,
      concernsDescription:
        ingredient.commercialProduct?.concernsDescription ?? null,
    }
  })
}

export const mapExposureRisksFieldsToData = (
  prefix: string,
  exposureRisks?: ExposureRisksFields,
) => {
  const data = {} as any
  const nameMap = new Map<keyof ExposureRisksFields, string>([
    ["skin", "SkinExposureRisk"],
    ["eye", "EyeExposureRisk"],
    ["inhalation", "InhalationExposureRisk"],
    ["oral", "OralExposureRisk"],
    ["other", "OtherExposureRisk"],
    ["otherDescription", "OtherExposureRiskDescription"],
  ])
  for (const keyString in exposureRisks) {
    const key = keyString as keyof ExposureRisksFields
    if (Object.hasOwn(exposureRisks, key)) {
      const name = `${prefix}${nameMap.get(key)}`
      data[name] = exposureRisks[key]
    }
  }

  return data
}

export const mapRiskAssessmentFieldsToCreateData = (
  fields: RiskAssessmentFields,
): Prisma.RiskAssessmentCreateInput => {
  return {
    ingredients: {
      createMany: {
        data: mapIngredientsFieldToData(fields.ingredients),
      },
    },
    ...mapRiskAssessmentFieldsToModel(fields),
  }
}

export const mapRiskAssessmentFieldsToUpdateData = (
  fields: RiskAssessmentFields,
): Prisma.RiskAssessmentUpdateInput => {
  const ingredientFields = fields.ingredients
  return {
    ingredients: {
      deleteMany: {
        id: {
          notIn: ingredientFields
            .filter((v) => v.id !== null)
            .map((v) => v.id as number),
        },
      },
      createMany: {
        data: mapIngredientsFieldToData(ingredientFields).filter(
          (data) => data.id === null,
        ),
      },
      update: mapIngredientsFieldToData(ingredientFields)
        .filter((data) => data.id !== null)
        .map((data) => {
          return { where: { id: data.id }, data: _.omit(data, "id") }
        }),
    },
    ...mapRiskAssessmentFieldsToModel(fields),
  }
}

export const mapRiskAssessmentFieldsToModel = (
  fields: RiskAssessmentFields,
): RiskAssessment => {
  let data: RiskAssessment = {} as RiskAssessment
  console.log({ fields })
  for (const key in fields) {
    if (Object.hasOwn(fields, key)) {
      switch (key) {
        case "ingredients":
          break
        case "averagePreparationAmount":
          const averagePreparationAmount = fields[key]
          data = {
            ...data,
            averagePreparationAmountQuantity: averagePreparationAmount.quantity,
            averagePreparationAmountUnit: averagePreparationAmount.unit,
          }
          break
        case "exposureRisks":
          const exposureRisks = fields[key]
          data = {
            ...data,
            ...mapExposureRisksFieldsToData("sds", exposureRisks.sds),
            ...mapExposureRisksFieldsToData(
              "pm",
              exposureRisks.productMonograph,
            ),
          }
          break
        case "rationaleList":
          data = {
            ...data,
            automaticRationale: fields[key].automatic,
            additionalRationale: fields[key].additional,
          }
          break
        case "ppe":
          const ppe = fields[key]
          data = {
            ...data,
            ppeGlovesRequired: ppe?.gloves?.required,
            ppeGlovesType: ppe?.gloves?.type,
            ppeCoatRequired: ppe?.coat?.required,
            ppeCoatType: ppe?.coat?.type,
            ppeMaskRequired: ppe?.mask?.required,
            ppeMaskType: ppe?.mask?.type ?? null,
            ppeEyeProtectionRequired: ppe?.eyeProtection?.required,
            ppeOther: ppe?.other ?? null,
          }
          break
        case "dateAssessed":
          data = { ...data, dateAssessed: new Date(fields[key]) }
          break
        default:
          data = {
            ...data,
            ...Object.fromEntries([[key, fields[key as keyof typeof fields]]]),
          }
          break
      }
    }
  }

  return data
}
