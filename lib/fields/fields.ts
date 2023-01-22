/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CoatType,
  Complexity,
  GlovesType,
  PhysicalForm,
  PreparationFrequency,
  RiskLevel,
  Storage,
  TimeUnit,
  Unit,
} from "@prisma/client"
import { Merge, Simplify } from "type-fest"
import * as z from "zod"

import { NullPartialDeep } from "types/util"

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
  physicalForm: z.nativeEnum(PhysicalForm),
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

const shortcutSchema = z
  .discriminatedUnion("hasShortcut", [
    z.object({
      hasShortcut: z.literal(false),
      variations: z
        .object({
          code: z.string().trim().min(1),
          name: z.string().trim().min(1),
        })
        .array()
        .max(0)
        .default([]),
      suffix: z.undefined(),
    }),
    z.object({
      hasShortcut: z.literal(true),
      //TODO: Simplify shortcut variations validation code
      variations: z
        .object({
          code: z
            .string()
            .trim()
            .transform((arg) => (arg === "" ? null : arg.toUpperCase()))
            .nullable(),
          name: z
            .string()
            .trim()
            .transform((arg) => (arg === "" ? null : arg))
            .nullable(),
        })
        .array()
        .transform((arr) =>
          arr.filter((v) => !(v.code === null && v.name === null)),
        )
        .superRefine((arg, ctx) => {
          for (const i in arg) {
            const variation = arg[i]
            if (!variation.code) {
              ctx.addIssue({
                code: "custom",
                message: "Required.",
                path: [i, "code"],
              })
            }

            if (!variation.name) {
              ctx.addIssue({
                code: "custom",
                message: "Required.",
                path: [i, "name"],
              })
            }
          }
        })
        .superRefine((arg, ctx) => {
          const codes = arg.map((v) => v.code)

          const duplicateIndexes = codes.reduce((dupeMap, code, i) => {
            if (!code) {
              return dupeMap
            }

            const duplicates = dupeMap.get(code)
            if (duplicates) {
              dupeMap.set(code, [...duplicates, i])
            } else if (codes.lastIndexOf(code) !== i) {
              dupeMap.set(code, [i])
            }
            return dupeMap
          }, new Map<string, number[]>())

          console.log({ duplicateIndexes })

          for (const duplicate of Array.from(duplicateIndexes.entries())) {
            for (const duplicateIndex of duplicate[1]) {
              ctx.addIssue({
                code: "custom",
                message: "No duplicates",
                path: [duplicateIndex, "code"],
              })
            }
          }
        })
        .pipe(
          z
            .object({
              code: z.string().trim().min(1),
              name: z.string().trim().min(1),
            })
            .array(),
        ),
      suffix: z
        .string()
        .trim()
        .transform((arg) => (arg === "" ? null : arg))
        .nullable()
        .default(null),
    }),
  ])
  .nullable()
  .default({ hasShortcut: false })

export const compoundSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1),
  ingredients: z.array(ingredientSchema).min(1),
  hasMasterFormulationRecord: z.boolean().default(false),
  shortcut: shortcutSchema,
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
    {
      shortcut?: NullPartialDeep<
        z.input<typeof shortcutSchema>,
        { ignoreKeys: "hasShortcut" }
      >
      ingredients: NullPartialIngredientFields[]
    }
  >
>

//==== MFR schema ====//

export const quantitySchema = z.object({
  amount: z.number().positive(),
  unit: z.nativeEnum(Unit),
})

export type Quantity = z.output<typeof quantitySchema>

export const mfrSchema = z.object({
  compoundId: z.number().int(),
  version: z.number().int().min(0).optional(),
  pharmaceuticalForm: z.string().trim().min(1),
  routeOfAdministration: z.string().trim().min(1),
  riskAssessmentId: z.number().int(),
  quantities: quantitySchema.array().min(1),
  expectedYield: quantitySchema,
  training: z.string().trim().min(1).array(),
  requiredEquipment: z.string().trim().min(1).array().min(1),
  calculations: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable()
    .default(null),
  compoundingMethod: z.string().trim().min(1),
  qualityControls: z
    .object({
      name: z.string().trim().min(1),
      expectedSpecification: z.string().trim().min(1),
    })
    .array()
    .min(1),
  packaging: z.string().trim().min(1),
  beyondUseDate: z.object({
    value: z.number().int().positive(),
    unit: z.nativeEnum(TimeUnit),
  }),
  storage: z.nativeEnum(Storage),
  labelling: z.string().trim().min(1).array().min(1),
  references: z.string().trim().min(1).array().min(1),
  developedBy: z.string().trim().min(1),
  verifiedBy: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable()
    .default(null),
  effectiveDate: utcDateZodString,
})

export type MfrFields = Simplify<z.output<typeof mfrSchema>>

const mfrSchemaWithVersion = mfrSchema.extend(
  mfrSchema.pick({ version: true }).required().shape,
)

export type MfrFieldsWithVersion = Simplify<
  z.output<typeof mfrSchemaWithVersion>
>

export type MfrFieldsInput = Simplify<z.input<typeof mfrSchema>>

export type NullPartialMfrFields = Simplify<
  NullPartialDeep<MfrFieldsInput, { ignoreKeys: "compoundId" | "version" }>
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

//======== Link schema =======

export const linkSchema = z.object({
  id: z.number().int().optional(),
  url: z.string().trim().min(1).url(),
  name: z.string().trim().min(1),
  description: z
    .string()
    .trim()
    .transform((arg) => (arg === "" ? null : arg))
    .nullable(),
  order: z.number().int().positive().optional(),
})

export type LinkFields = z.output<typeof linkSchema>
export type LinkFieldsInput = z.input<typeof linkSchema>

export type NullPartialLinkFields = NullPartialDeep<
  LinkFieldsInput,
  { ignoreKeys: "id" }
>

export const linkDirectorySchema = z.object({ links: linkSchema.array() })
export type LinkDirectoryFields = z.output<typeof linkDirectorySchema>
export type LinkDirectoryFieldsInput = z.input<typeof linkDirectorySchema>

export type NullPartialLinkDirectoryFields = { links: NullPartialLinkFields[] }

//======= Settings schema =========

const createFieldPresetSchema = <T extends z.ZodTypeAny>(fieldSchema: T) =>
  z
    .object({
      label: z
        .string()
        .trim()
        .transform((arg) => (arg === "" ? undefined : arg))
        .optional(),
      value: fieldSchema,
    })
    .partial({ label: true })
    .refine((arg) => {
      console.log({ arg })
      return !(
        ((arg as { label?: string }).label?.length ?? 0) === 0 &&
        typeof (arg as { value: any }).value !== "string"
      )
    }, "Label is required if value is not a string.")

const createFieldArrayPresetSingleSchema = <T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T, any>,
) => createFieldPresetSchema(fieldSchema.element)

export type FieldPresetFields<T = any> = z.infer<
  ReturnType<typeof createFieldPresetSchema<z.ZodType<T>>>
>

export type NullPartialFieldPresetFields<T = any> = NullPartialDeep<
  FieldPresetFields<T>
>

export type FieldArrayPresetSingleFields<T = any> = z.infer<
  ReturnType<typeof createFieldArrayPresetSingleSchema<z.ZodType<T>>>
>
export type NullPartialFieldArrayPresetSingleFields<T = any> = NullPartialDeep<
  FieldArrayPresetSingleFields<T>
>

export type FieldArrayPresetMultipleFields<T = any> = z.infer<
  ReturnType<typeof createFieldArrayPresetMultipleSchema<z.ZodType<T>>>
>
export type NullPartialFieldArrayPresetMultipleFields<T = any> =
  NullPartialDeep<FieldArrayPresetMultipleFields<T>>

const createFieldArrayPresetMultipleSchema = <T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T, any>,
) =>
  z.object({
    label: z.string().trim(),
    value: fieldSchema,
  })

function createFieldArrayPresetSchema<T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T, any>,
  multiple: true,
): ReturnType<typeof createFieldArrayPresetMultipleSchema<T>>

function createFieldArrayPresetSchema<T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T, any>,
  multiple?: false | undefined,
): ReturnType<typeof createFieldArrayPresetSingleSchema<T>>

function createFieldArrayPresetSchema<T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T, any>,
  multiple?: boolean,
):
  | ReturnType<typeof createFieldArrayPresetMultipleSchema<T>>
  | ReturnType<typeof createFieldArrayPresetSingleSchema<T>> {
  if (multiple) {
    return createFieldArrayPresetMultipleSchema(fieldSchema)
  } else {
    return createFieldArrayPresetSingleSchema(fieldSchema)
  }
}

export const settingsSchema = z.object({
  id: z.number().int().optional(),
  //TODO: Implement creating field preset schemas dynamically
  mfrFieldPresets: z.object({
    requiredEquipment: createFieldArrayPresetSchema(
      mfrSchema.shape.requiredEquipment,
    ).array(),
    compoundingMethod: createFieldPresetSchema(
      mfrSchema.shape.compoundingMethod,
    ).array(),
    qualityControls: createFieldArrayPresetSchema(
      mfrSchema.shape.qualityControls,
      true,
    ).array(),
    packaging: createFieldPresetSchema(mfrSchema.shape.packaging).array(),
    labelling: createFieldArrayPresetSchema(mfrSchema.shape.labelling).array(),
    references: createFieldArrayPresetSchema(
      mfrSchema.shape.references,
    ).array(),
  }),
})

export type SettingsFields = z.output<typeof settingsSchema>
export type SettingsFieldsInput = z.input<typeof settingsSchema>

export type NullPartialSettingsFields = Merge<
  NullPartialDeep<SettingsFieldsInput, { ignoreKeys: "id" }>,
  {
    mfrFieldPresets: NullPartialDeep<SettingsFieldsInput["mfrFieldPresets"]>
  }
>
