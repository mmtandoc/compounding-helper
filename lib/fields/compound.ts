import { PhysicalForm } from "@prisma/client"
import { Merge, Simplify } from "type-fest"
import * as z from "zod"

import { GetElementType, NullPartialDeep } from "types/util"

import { refineNoDuplicates, transformStringToNumber } from "./utils"

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
        .superRefine((arg, ctx) =>
          refineNoDuplicates(
            arg,
            ctx,
            "code",
            (v: GetElementType<typeof arg>) => v.code,
          ),
        )
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
