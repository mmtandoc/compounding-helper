import { Merge } from "type-fest"
import * as z from "zod"

import { GetElementType, NullableDeep } from "types/util"

import { mfrSchema } from "./mfr"
import { refineNoDuplicates } from "./utils"

//======= Settings schema =========

// Field Preset Schema

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
      return !(
        ((arg as { label?: string }).label?.length ?? 0) === 0 &&
        typeof (arg as unknown as { value: any }).value !== "string"
      )
    }, "Label is required if value is not a string.")

export type FieldPresetFields<T = any> = z.infer<
  ReturnType<typeof createFieldPresetSchema<z.ZodType<T>>>
>

export type NullableFieldPresetFields<T = any> = NullableDeep<
  FieldPresetFields<T>
>

const createFieldPresetsSchema = <T extends z.ZodTypeAny>(fieldSchema: T) =>
  createFieldPresetSchema(fieldSchema)
    .array()
    .superRefine((arg, ctx) =>
      refineNoDuplicates(
        arg as unknown as { label?: string; value: unknown }[],
        ctx,
        "label",
        (v: { label?: string; value: unknown }) => {
          if (typeof v.value === "string" && v.value && !v.label) {
            return v.value
          }
          return v.label
        },
      ),
    )

const createFieldArrayPresetSingleSchema = <T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T>,
) => createFieldPresetSchema(fieldSchema.element)

export type FieldArrayPresetFields<
  T = any,
  Multiple extends boolean = false,
> = Multiple extends false
  ? z.infer<ReturnType<typeof createFieldArrayPresetSingleSchema<z.ZodType<T>>>>
  : z.infer<
      ReturnType<typeof createFieldArrayPresetMultipleSchema<z.ZodType<T>>>
    >

export type NullableFieldArrayPresetFields<
  T = any,
  Multiple extends boolean = false,
> = NullableDeep<FieldArrayPresetFields<T, Multiple>>

const createFieldArrayPresetMultipleSchema = <T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T>,
) =>
  z.object({
    label: z.string().trim(),
    value: fieldSchema,
  })

function createFieldArrayPresetsSchema<T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T>,
  multiple: true,
): z.ZodEffects<
  z.ZodArray<ReturnType<typeof createFieldArrayPresetMultipleSchema<T>>>
>

function createFieldArrayPresetsSchema<T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T>,
  multiple?: false | undefined,
): z.ZodEffects<
  z.ZodArray<ReturnType<typeof createFieldArrayPresetSingleSchema<T>>>
>

function createFieldArrayPresetsSchema<T extends z.ZodTypeAny>(
  fieldSchema: z.ZodArray<T>,
  multiple?: boolean,
):
  | z.ZodEffects<
      z.ZodArray<ReturnType<typeof createFieldArrayPresetMultipleSchema<T>>>
    >
  | z.ZodEffects<
      z.ZodArray<ReturnType<typeof createFieldArrayPresetSingleSchema<T>>>
    > {
  if (multiple) {
    return createFieldArrayPresetMultipleSchema(fieldSchema)
      .array()
      .superRefine((arg, ctx) =>
        refineNoDuplicates(
          arg,
          ctx,
          "label",
          (v: GetElementType<typeof arg>) => v.label,
        ),
      )
  } else {
    return createFieldArrayPresetSingleSchema(fieldSchema)
      .array()
      .superRefine((arg, ctx) =>
        refineNoDuplicates(
          arg as unknown as { label?: string; value: unknown }[],
          ctx,
          "label",
          (v: { label?: string; value: unknown }) => {
            // If value is a string and label is empty, use value as label
            if (typeof v.value === "string" && v.label === undefined) {
              return v.value
            }
            return v.label
          },
        ),
      )
  }
}

export const settingsSchema = z.object({
  id: z.number().int().optional(),
  mfrFieldPresets: z.object({
    requiredEquipment: createFieldArrayPresetsSchema(
      mfrSchema.shape.requiredEquipment,
    ),
    compoundingMethod: createFieldPresetsSchema(
      mfrSchema.shape.compoundingMethod,
    ),
    qualityControls: createFieldArrayPresetsSchema(
      mfrSchema.shape.qualityControls,
      true,
    ),
    packaging: createFieldPresetsSchema(mfrSchema.shape.packaging),
    labelling: createFieldArrayPresetsSchema(mfrSchema.shape.labelling),
    references: createFieldArrayPresetsSchema(mfrSchema.shape.references),
  }),
  shortcutSuffixes: z
    .object({
      code: z
        .string()
        .trim()
        .min(1)
        .transform((arg) => arg.toUpperCase()),
      description: z.string().trim().min(1),
    })
    .array()
    .superRefine((arg, ctx) =>
      refineNoDuplicates(
        arg,
        ctx,
        "code",
        (v: GetElementType<typeof arg>) => v.code,
      ),
    ),
})

export type SettingsFields = z.output<typeof settingsSchema>
export type SettingsFieldsInput = z.input<typeof settingsSchema>

export type NullableSettingsFields = Merge<
  NullableDeep<SettingsFieldsInput, { ignoreKeys: "id" }>,
  {
    mfrFieldPresets: NullableDeep<SettingsFieldsInput["mfrFieldPresets"]>
  }
>
