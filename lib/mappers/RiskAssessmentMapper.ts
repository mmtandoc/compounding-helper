import { RiskAssessment, Unit } from "@prisma/client"
import { capitalize } from "lodash"
import { SetOptional } from "type-fest"

import {
  ExposureRisksFields,
  RiskAssessmentFields,
  riskAssessmentSchema,
} from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { RiskAssessmentAll } from "types/models"

import CompoundMapper from "./CompoundMapper"

type FilterByKeyPrefix<
  T,
  Prefix extends string,
> = keyof T extends `${Prefix}${infer _}` ? never : keyof T

type ExposureRiskPrefix = "sds" | "pm"
type ExposureRiskType = "Skin" | "Eye" | "Inhalation" | "Oral" | "Other"

type ExposureRiskKey = `${ExposureRiskPrefix}${ExposureRiskType}ExposureRisk`

type ExposureRisksData = Record<ExposureRiskKey, boolean> &
  Record<`${ExposureRiskPrefix}OtherExposureRiskDescription`, string | null>

const mapExposureRisksFieldsToFieldValues = <
  TPrefix extends ExposureRiskPrefix,
>(
  prefix: TPrefix,
  exposureRisks: Pick<
    RiskAssessment,
    FilterByKeyPrefix<RiskAssessment, TPrefix>
  >,
): ExposureRisksFields => {
  const data = {} as ExposureRisksFields
  const nameMap = new Map<string, keyof ExposureRisksFields>([
    [`${prefix}SkinExposureRisk`, "skin"],
    [`${prefix}EyeExposureRisk`, "eye"],
    [`${prefix}InhalationExposureRisk`, "inhalation"],
    [`${prefix}OralExposureRisk`, "oral"],
    [`${prefix}OtherExposureRisk`, "other"],
    [`${prefix}OtherExposureRiskDescription`, "otherDescription"],
  ])
  for (const keyString in exposureRisks) {
    const key = keyString as keyof typeof exposureRisks
    if (Object.hasOwn(exposureRisks, key) && nameMap.has(keyString)) {
      const fieldKey = nameMap.get(keyString) as keyof ExposureRisksFields
      if (fieldKey !== "otherDescription") {
        data[fieldKey] = exposureRisks[key] as boolean
      } else {
        data[fieldKey] = (exposureRisks[key] as string | null) ?? undefined
      }
    }
  }

  return data
}

const mapExposureRisksFieldsToModel = (
  prefix: ExposureRiskPrefix,
  exposureRisks?: ExposureRisksFields,
): ExposureRisksData => {
  const data = {} as ExposureRisksData

  for (const keyString in exposureRisks) {
    const key = keyString as keyof ExposureRisksFields
    if (key !== "otherDescription") {
      data[`${prefix}${capitalize(key) as ExposureRiskType}ExposureRisk`] =
        exposureRisks[key]
    } else {
      data[`${prefix}OtherExposureRiskDescription`] = exposureRisks[key] ?? null
    }
  }

  return data
}

const toFieldValues = (data: RiskAssessmentAll): RiskAssessmentFields => {
  const fieldValues: Zod.input<typeof riskAssessmentSchema> = {
    id: data.id,
    compound: CompoundMapper.toFieldValues(data.compound),
    complexity: data.complexity,
    preparationFrequency: data.preparationFrequency,
    isSmallQuantity: data.isSmallQuantity,
    isPreparedOccasionally: data.isPreparedOccasionally,
    averagePreparationAmount: {
      quantity: data.averagePreparationAmountQuantity as number,
      unit: data.averagePreparationAmountUnit as Unit,
    },
    isConcentrationHealthRisk: data.isConcentrationHealthRisk,
    hasVerificationSteps: data.hasVerificationSteps,
    haveAppropriateFacilities: data.haveAppropriateFacilities,
    isWorkflowUninterrupted: data.isWorkflowUninterrupted,
    workflowStandardsProcess: data.workflowStandardsProcess ?? undefined,
    microbialContaminationRisk: data.microbialContaminationRisk,
    crossContaminationRisk: data.crossContaminationRisk,
    requireSpecialEducation: data.requireSpecialEducation,
    requireVentilation: data.requireVentilation,
    exposureRisks: {
      sds: mapExposureRisksFieldsToFieldValues("sds", data),
      productMonograph:
        data.pmSkinExposureRisk === null
          ? undefined
          : mapExposureRisksFieldsToFieldValues("pm", data),
    },
    ppe: {
      gloves: {
        required: data.ppeGlovesRequired,
        type: data.ppeGlovesType ?? undefined,
      },
      coat: {
        required: data.ppeCoatRequired,
        type: data.ppeCoatType ?? undefined,
      },
      mask: {
        required: data.ppeMaskRequired,
        type: data.ppeMaskType ?? undefined,
      },
      eyeProtection: { required: data.ppeEyeProtectionRequired },
      other: data.ppeOther ?? undefined,
    },
    requireEyeWashStation: data.requireEyeWashStation,
    requireSafetyShower: data.requireSafetyShower,
    riskLevel: data.riskLevel,
    rationaleList: {
      automatic: data.automaticRationale,
      additional: data.additionalRationale,
    },
    compoundingSupervisor: data.compoundingSupervisor,
    dateAssessed: toIsoDateString(data.dateAssessed),
  }
  return riskAssessmentSchema.parse(fieldValues)
}

//TODO: Refactor
const toModel = (
  fields: RiskAssessmentFields,
): SetOptional<RiskAssessment, "id" | "compoundId"> => {
  let data = {} as SetOptional<RiskAssessment, "id" | "compoundId">
  console.log({ fields })
  for (const key in fields) {
    if (Object.hasOwn(fields, key)) {
      switch (key) {
        case "compound":
          data = { ...data, compoundId: fields[key].id }
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
