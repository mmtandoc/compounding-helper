import {
  CoatType,
  Complexity,
  GlovesType,
  PreparationFrequency,
  RiskLevel,
  Unit,
} from "@prisma/client"
import { Merge, Simplify } from "type-fest"
import * as z from "zod"

import { NullPartialDeep } from "types/util"

import { NullPartialCompoundFields, compoundSchema } from "./compound"
import { utcDateZodString } from "./utils"

export const exposureRisksSchema = z
  .object({
    skin: z.boolean(),
    eye: z.boolean(),
    inhalation: z.boolean(),
    oral: z.boolean(),
    other: z.boolean(),
    otherDescription: z.string().trim().min(1).optional(),
  })
  .superRefine((arg, ctx) => {
    if (arg.other && !arg.otherDescription) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required.",
        path: ["otherDescription"],
      })
    }
  })

export type ExposureRisksFields = z.output<typeof exposureRisksSchema>
export type ExposureRisksFieldsInput = z.input<typeof exposureRisksSchema>
const refinePPE = (arg: any, ctx: any) =>
  arg.required &&
  (arg.type === null || arg.type === undefined) &&
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Required.",
    path: ["type"],
  })

export const riskAssessmentSchema = z.object({
  id: z.number().int().optional(),
  compound: compoundSchema,
  complexity: z.nativeEnum(Complexity),
  isPreparedOccasionally: z.boolean(),
  preparationFrequency: z.nativeEnum(PreparationFrequency),
  isSmallQuantity: z.boolean(),
  averagePreparationAmount: z.object({
    quantity: z.number({ invalid_type_error: "Quantity must be a number." }),
    unit: z.nativeEnum(Unit),
  }),
  isConcentrationHealthRisk: z.boolean(),
  requireSpecialEducation: z.boolean(),
  hasVerificationSteps: z.boolean(),
  haveAppropriateFacilities: z.boolean(),
  requireVentilation: z.boolean(),
  isWorkflowUninterrupted: z.boolean(),
  workflowStandardsProcess: z.string().trim().min(1).optional(),
  microbialContaminationRisk: z.boolean(),
  crossContaminationRisk: z.boolean(),
  exposureRisks: z.object({
    sds: exposureRisksSchema,
    productMonograph: exposureRisksSchema.optional(),
  }),
  ppe: z.object({
    gloves: z
      .object({
        required: z.boolean(),
        type: z.nativeEnum(GlovesType).optional(),
      })
      .superRefine(refinePPE),
    coat: z
      .object({
        required: z.boolean(),
        type: z.nativeEnum(CoatType).optional(),
      })
      .superRefine(refinePPE),
    mask: z
      .object({
        required: z.boolean(),
        type: z.string().trim().min(1).nullish(),
      })
      .superRefine(refinePPE),
    eyeProtection: z.object({
      required: z.boolean(),
    }),
    other: z.string().trim().nullish(),
  }),
  requireEyeWashStation: z.boolean(),
  requireSafetyShower: z.boolean(),
  riskLevel: z.nativeEnum(RiskLevel),
  rationaleList: z.object({
    automatic: z.string().trim().min(1).array(),
    additional: z.string().trim().min(1).array(),
  }),
  compoundingSupervisor: z.string().trim().min(1),
  dateAssessed: utcDateZodString, //TODO: Check that date is not in the future
})

export type RiskAssessmentFields = z.output<typeof riskAssessmentSchema>
export type RiskAssessmentFieldsInput = z.input<typeof riskAssessmentSchema>

export type NullPartialRiskAssessmentFields = Simplify<
  Merge<
    NullPartialDeep<RiskAssessmentFieldsInput, { ignoreKeys: "id" }>,
    { compound: NullPartialCompoundFields }
  >
>
