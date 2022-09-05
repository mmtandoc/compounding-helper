import { Prisma } from "@prisma/client"
import _ from "lodash"
import {
  IngredientFields,
  ExposureRisksFields,
  RiskAssessmentFields,
} from "types/fields"

export const mapIngredientsFieldToData = (ingredients: IngredientFields[]) => {
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
  for (const key in exposureRisks) {
    if (Object.prototype.hasOwnProperty.call(exposureRisks, key)) {
      const nameMap = new Map<keyof ExposureRisksFields, string>([
        ["skin", "SkinExposureRisk"],
        ["eye", "EyeExposureRisk"],
        ["inhalation", "InhalationExposureRisk"],
        ["oral", "OralExposureRisk"],
        ["other", "OtherExposureRisk"],
        ["otherDescription", "OtherExposureRiskDescription"],
      ])
      const name = `${prefix}${nameMap.get(key as keyof ExposureRisksFields)}`
      data[name] = exposureRisks[key as keyof ExposureRisksFields]
    }
  }

  return data
}

export const mapRiskAssessmentFieldsToCreateData = (
  fields: RiskAssessmentFields,
): Prisma.RiskAssessmentCreateArgs["data"] => {
  let data = {} as Partial<Prisma.RiskAssessmentCreateArgs["data"]>
  console.log({ fields })
  for (const key in fields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      switch (key) {
        case "ingredients":
          data[key] = {
            createMany: {
              data: mapIngredientsFieldToData(fields[key]),
            },
          }
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
            ppeMaskType: ppe?.mask?.type,
            ppeEyeProtectionRequired: ppe?.eyeProtection?.required,
            ppeOther: ppe?.other,
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

  return data as Prisma.RiskAssessmentCreateArgs["data"]
}

export const mapRiskAssessmentFieldsToUpdateData = (
  fields: RiskAssessmentFields,
): Prisma.RiskAssessmentUpdateArgs["data"] => {
  let data = {} as Prisma.RiskAssessmentUpdateArgs["data"]
  console.log({ fields })
  for (const key in fields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      switch (key) {
        case "ingredients":
          data[key] = {
            deleteMany: {
              id: {
                notIn: fields[key]
                  .filter((v) => v.id !== null)
                  .map((v) => v.id as number),
              },
            },
            createMany: {
              data: mapIngredientsFieldToData(fields[key]).filter(
                (data) => data.id === null,
              ),
            },
            update: mapIngredientsFieldToData(fields[key])
              .filter((data) => data.id !== null)
              .map((data) => {
                return { where: { id: data.id }, data: _.omit(data, "id") }
              }),
          }
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
            ppeMaskType: ppe?.mask?.type,
            ppeEyeProtectionRequired: ppe?.eyeProtection?.required,
            ppeOther: ppe?.other,
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

  return data as Prisma.RiskAssessmentUpdateArgs["data"]
}
