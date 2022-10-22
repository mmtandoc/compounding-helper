import { Merge, Simplify } from "type-fest"
import { NullPartialDeep } from "types/util"
import * as z from "zod"
import { transformStringToNumber, utcDateZodString } from "./utils"

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (
    issue.code === z.ZodIssueCode.invalid_type &&
    ["null", "nan", "undefined"].includes(issue.received)
  ) {
    return { message: "Required." }
  }
  if (
    issue.code === z.ZodIssueCode.too_small &&
    issue.type === "string" &&
    issue.minimum === 1
  ) {
    return { message: "Required." }
  }

  return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)

//==== Chemical schema =====

export const chemicalSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1),
  casNumber: z
    .string()
    .trim()
    .superRefine((arg, ctx) => {
      if (!/\d{2,7}-\d{2}-\d{1}/.test(arg)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: "regex",
          message:
            "CAS number must be in the form of XXXXXXX-YY-Z, where the first part X is 2 to 7 digits long.",
          fatal: true,
        })
        return z.NEVER
      }
      /*
       The check digit is found by taking the last digit times 1,
       the preceding digit times 2, the preceding digit times 3 etc.,
       adding all these up and computing the sum modulo 10.
      */
      const digits = Array.from(arg.replaceAll("-", "")).map(Number)
      const checkDigit = digits.pop()
      digits.reverse()
      const checksum =
        digits.reduce((sum, digit, i) => sum + digit * (i + 1), 0) % 10
      if (checkDigit !== checksum) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "CAS number is invalid. Please double check that the CAS number was inputted correctly.",
        })
      }
    })
    .nullish(),
  hasNoCasNumber: z.boolean(),
  synonyms: z.array(z.string().trim().min(1)).nullable(),
  nioshTable: z.number().int().min(1).max(3).or(z.literal(-1)),
  nioshRevisionDate: utcDateZodString.nullable(), //TODO: Check that date is not in the future
})

export type ChemicalFields = z.output<typeof chemicalSchema>
export type ChemicalFieldsInput = z.input<typeof chemicalSchema>

export type NullPartialChemicalFields = Simplify<
  Merge<NullPartialDeep<ChemicalFieldsInput>, Pick<ChemicalFieldsInput, "id">>
>

//==== Product schema =====

export const productSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1),
  chemicalId: z.number().int(),
  vendorId: z.number().int(),
})

export type ProductFields = Simplify<z.output<typeof productSchema>>
export type ProductFieldsInput = Simplify<z.input<typeof productSchema>>

export type NullPartialProductFields = Simplify<
  Merge<NullPartialDeep<ProductFieldsInput>, Pick<ProductFieldsInput, "id">>
>

//==== SDS & Hazard schemas =====

/* export type HazardFields = {
  id?: number
  classId: number
  categoryId: number
  subcategoryId?: number | null
  additionalInfo?: string | null
} */
export const hazardSchema = z.object({
  id: z.number().int().optional(),
  classId: z.number(),
  categoryId: z.number(),
  subcategoryId: z.number().nullable(),
  additionalInfo: z.string().trim().min(1).optional(),
})

export type HazardFields = Simplify<z.output<typeof hazardSchema>>
export type HazardFieldsInput = Simplify<z.input<typeof hazardSchema>>

export type NullPartialHazardFields = Simplify<
  NullPartialDeep<HazardFieldsInput>
>

export const sdsSchema = z.object({
  id: z.number().int().optional(),
  chemicalId: z.number().int(),
  productId: z.number().int(),
  hmisHazardLevel: transformStringToNumber(
    z
      .number({
        invalid_type_error: "HMIS health hazard level must be a number.",
      })
      .int("HMIS health hazard level must be an integer")
      .min(0, "HMIS health hazard level must a number from 0 to 4.")
      .max(4, "HMIS health hazard level must a number from 0 to 4."),
  ),
  revisionDate: utcDateZodString, //TODO: Check that date is not in the future
  requireVentilation: z.boolean(),
  hazards: z.array(hazardSchema),
  filename: z
    .string()
    .trim()
    .nullable()
    .transform((arg) => (arg === null ? "N/A" : arg)),
})

export type SdsFields = z.output<typeof sdsSchema>
export type SdsFieldsInput = z.input<typeof sdsSchema>

export type NullPartialSdsFields = Simplify<
  Merge<NullPartialDeep<SdsFieldsInput>, Pick<SdsFieldsInput, "id">>
>

//==== Compound & Ingredient schemas ====//

export const ingredientSchemaBase = z.object({
  order: z.number().int(),
  chemicalId: z.number().int(),
  sdsId: z.number().int(),
  physicalForm: z.enum(["cream", "ointment", "powder", "liquid", "solid"]),
  isCommercialProduct: z.boolean(),
  commercialProduct: z.object({
    name: z.string().trim().min(1),
    din: transformStringToNumber(z.number().int()).nullish(),
    hasNoDin: z.boolean(),
    hasProductMonographConcerns: z.boolean(),
    concernsDescription: z.string().trim().min(1).nullish(),
  }),
})

const commercialIngredientSchema = ingredientSchemaBase.extend({
  chemicalId: ingredientSchemaBase.shape.chemicalId.nullish(),
  sdsId: ingredientSchemaBase.shape.sdsId.nullish(),
  isCommercialProduct: z.literal(true),
})

const nonCommercialIngredientSchema = ingredientSchemaBase.extend({
  isCommercialProduct: z.literal(false),
  commercialProduct: z.object({
    name: z.undefined(),
    din: z.undefined(),
    hasNoDin: z.undefined(),
    hasProductMonographConcerns: z.undefined(),
    concernsDescription: z.undefined(),
  }),
})

export const ingredientSchema = z.discriminatedUnion("isCommercialProduct", [
  commercialIngredientSchema,
  nonCommercialIngredientSchema,
])

export type IngredientFields = Simplify<z.output<typeof ingredientSchema>>
export type IngredientFieldsInput = Simplify<z.input<typeof ingredientSchema>>

export type NullPartialIngredientFields = Simplify<
  NullPartialDeep<IngredientFieldsInput, { ignoreKeys: "order" }>
>

export const compoundSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1),
  ingredients: z.array(ingredientSchema).min(1),
  hasMasterFormulationRecord: z.boolean().default(false),
  beyondUseDate: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable()
    .default(null),
  notes: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable()
    .default(null),
})

export type CompoundFields = z.output<typeof compoundSchema>
export type CompoundFieldsInput = z.input<typeof compoundSchema>

export type NullPartialCompoundFields = Simplify<
  Merge<
    Merge<
      NullPartialDeep<CompoundFieldsInput>,
      Pick<CompoundFieldsInput, "id">
    >,
    { ingredients: NullPartialIngredientFields[] }
  >
>

//==== Risk Assessment schemas ====//
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
  !arg.type &&
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Required.",
    path: ["type"],
  })

export const riskAssessmentSchema = z.object({
  id: z.number().int().optional(),
  compound: compoundSchema,
  complexity: z.enum(["simple", "moderate", "complex"]),
  isPreparedOccasionally: z.boolean(),
  preparationFrequency: z.enum(["daily", "weekly", "monthly"]),
  isSmallQuantity: z.boolean(),
  averagePreparationAmount: z.object({
    quantity: z.number({ invalid_type_error: "Quantity must be a number." }),
    unit: z.enum(["g", "ml"]),
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
        type: z.enum(["regular", "chemotherapy", "double"]).optional(),
      })
      .superRefine(refinePPE),
    coat: z
      .object({
        required: z.boolean(),
        type: z.enum(["designated", "disposable"]).optional(),
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
  riskLevel: z.enum(["A", "B", "C"]),
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
