import { RiskAssessment } from "@prisma/client"
import {
  NullPartialRiskAssessmentFields,
  riskAssessmentSchema,
} from "lib/fields"
import { SetOptional } from "type-fest"
import { ExposureRisksFields, RiskAssessmentFields } from "lib/fields"
import { RiskAssessmentAll } from "types/models"
import IngredientMapper from "./IngredientMapper"

const mapExposureRisksFieldsToModel = (
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

const toFieldValues = (
  data: RiskAssessmentAll,
): NullPartialRiskAssessmentFields => {
  return riskAssessmentSchema.parse({
    id: data.id,
    compoundName: data.compoundName,
    ingredients: data.ingredients
      .map(IngredientMapper.toFieldValues)
      .sort((a, b) => a.order - b.order),
    complexity: data.complexity,
    preparationFrequency: data.preparationFrequency,
    isSmallQuantity: data.isSmallQuantity,
    isPreparedOccasionally: data.isPreparedOccasionally,
    averagePreparationAmount: {
      quantity: data.averagePreparationAmountQuantity,
      unit: data.averagePreparationAmountUnit,
    },
    isConcentrationHealthRisk: data.isConcentrationHealthRisk,
    hasVerificationSteps: data.hasVerificationSteps,
    haveAppropriateFacilities: data.haveAppropriateFacilities,
    isWorkflowUninterrupted: data.isWorkflowUninterrupted,
    workflowStandardsProcess: data.workflowStandardsProcess,
    microbialContaminationRisk: data.microbialContaminationRisk,
    crossContaminationRisk: data.crossContaminationRisk,
    requireSpecialEducation: data.requireSpecialEducation,
    requireVentilation: data.requireVentilation,
    exposureRisks: {
      sds: {
        skin: data.sdsSkinExposureRisk,
        eye: data.sdsEyeExposureRisk,
        inhalation: data.sdsInhalationExposureRisk,
        oral: data.sdsOralExposureRisk,
        other: data.sdsOtherExposureRisk,
        otherDescription: data.sdsOtherExposureRiskDescription,
      },
      productMonograph: {
        skin: data.pmSkinExposureRisk,
        eye: data.pmEyeExposureRisk,
        inhalation: data.pmInhalationExposureRisk,
        oral: data.pmOralExposureRisk,
        other: data.pmOtherExposureRisk,
        otherDescription: data.pmOtherExposureRiskDescription,
      },
    },
    ppe: {
      gloves: { required: data.ppeGlovesRequired, type: data.ppeGlovesType },
      coat: { required: data.ppeCoatRequired, type: data.ppeCoatType },
      mask: { required: data.ppeMaskRequired, type: data.ppeMaskType },
      eyeProtection: { required: data.ppeEyeProtectionRequired },
      other: data.ppeOther,
    },
    requireEyeWashStation: data.requireEyeWashStation,
    requireSafetyShower: data.requireSafetyShower,
    riskLevel: data.riskLevel,
    rationaleList: {
      automatic: data.automaticRationale,
      additional: data.additionalRationale,
    },
    compoundingSupervisor: data.compoundingSupervisor,
    dateAssessed: data.dateAssessed.toLocaleDateString("en-CA"),
  })
}

//TODO: Refactor
const toModel = (
  fields: RiskAssessmentFields,
): SetOptional<RiskAssessment, "id"> => {
  let data = {} as SetOptional<RiskAssessment, "id">
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
            ...mapExposureRisksFieldsToModel("sds", exposureRisks.sds),
            ...mapExposureRisksFieldsToModel(
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
            ppeGlovesType: ppe?.gloves?.type ?? null,
            ppeCoatRequired: ppe?.coat?.required,
            ppeCoatType: ppe?.coat?.type ?? null,
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

// eslint-disable-next-line import/no-anonymous-default-export
export default { toFieldValues, toModel }
