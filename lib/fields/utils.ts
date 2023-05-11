/* eslint-disable @typescript-eslint/no-explicit-any */
import Zod, * as z from "zod"
import { errorUtil } from "zod/lib/helpers/errorUtil"

export type ZodDeepNullable<T extends Zod.ZodTypeAny> = T extends Zod.ZodObject<
  infer Shape,
  infer Params,
  infer Catchall
>
  ? Zod.ZodObject<
      {
        [k in keyof Shape]: Zod.ZodNullable<ZodDeepNullable<Shape[k]>>
      },
      Params,
      Catchall
    >
  : T extends Zod.ZodArray<infer Type, infer Card>
  ? Zod.ZodArray<ZodDeepNullable<Type>, Card>
  : T extends Zod.ZodOptional<infer Type>
  ? Zod.ZodOptional<ZodDeepNullable<Type>>
  : T extends Zod.ZodNullable<infer Type>
  ? Zod.ZodNullable<ZodDeepNullable<Type>>
  : T extends Zod.ZodTuple<infer Items>
  ? {
      [k in keyof Items]: Items[k] extends Zod.ZodTypeAny
        ? ZodDeepNullable<Items[k]>
        : never
    } extends infer PI
    ? PI extends Zod.ZodTupleItems
      ? Zod.ZodTuple<PI>
      : never
    : never
  : T

export function deepNullableify<T extends Zod.ZodTypeAny>(
  schema: T,
): ZodDeepNullable<T> {
  if (schema instanceof Zod.ZodObject) {
    const newShape: any = {}

    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key]
      newShape[key] = Zod.ZodNullable.create(deepNullableify(fieldSchema))
    }
    return new Zod.ZodObject({
      ...schema._def,
      shape: () => newShape,
    }) as any
  } else if (schema instanceof Zod.ZodArray) {
    return Zod.ZodArray.create(deepNullableify(schema.element)) as any
  } else if (schema instanceof Zod.ZodOptional) {
    return Zod.ZodOptional.create(deepNullableify(schema.unwrap())) as any
  } else if (schema instanceof Zod.ZodNullable) {
    return Zod.ZodNullable.create(deepNullableify(schema.unwrap())) as any
  } else if (schema instanceof Zod.ZodTuple) {
    return Zod.ZodTuple.create(
      schema.items.map((item: any) => deepNullableify(item)),
    ) as any
  } else {
    return schema as any
  }
}

export const castStringToDate = (dateSchema: z.ZodDate = z.date()) =>
  z.preprocess((arg) => {
    if (arg === "" || arg === null) return
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg)
  }, dateSchema)

export const castStringToNumber = (numberSchema: z.ZodNumber = z.number()) =>
  z.preprocess((arg) => {
    if (arg === "" || arg === null) return
    if (
      (typeof arg == "string" || typeof arg == "number") &&
      !Number.isNaN(arg)
    )
      return Number(arg)
  }, numberSchema)

export const transformStringToNumber = (
  numberSchema: z.ZodNumber = z.number(),
) =>
  numberSchema.or(
    z.string().transform((arg, ctx) => {
      const result = castStringToNumber(numberSchema).safeParse(arg)
      if (result.success) {
        return result.data
      } else {
        result.error.issues.map((issue) => ctx.addIssue(issue))
        return NaN
      }
    }),
    //.refine((arg) => !Number.isNaN(arg)),
  )

/**
 * Deeply allow all properties to accept null, accept for the properties specified by "ids".
 * Meant to keep "id" property as non-nullable, as required by Prisma.
 * @param schema Zod schema object
 * @param ids Optional. If not provided, will to use `{id: true}` if "id" property exists. Otherwise, defaults to empty object.
 */
export const deepNullableifyWithIds = <
  T extends Zod.ZodRawShape,
  Mask extends {
    [k in keyof T]?: true
  },
>(
  schema: Zod.ZodObject<T>,
  ids?: Mask,
) =>
  deepNullableify(schema).merge(
    schema.pick(ids ?? (Object.hasOwn(schema.shape, "id") ? { id: true } : {})),
  )

export const isoDateZodString = (
  params?: Parameters<typeof z.string>[0],
  invalidDateError?: errorUtil.ErrMessage,
) =>
  z
    .string(params)
    .regex(/\d{4}-[01]\d-[0-3]\d/, invalidDateError ?? "Date is invalid.") //ISO Date without time

export const refineNoDuplicates = <
  T,
  TProperty extends string | number | undefined | null,
>(
  arg: Array<T>,
  ctx: z.RefinementCtx,
  propertyPath: string,
  duplicateAccessorFn: (item: T) => TProperty,
) => {
  const values = arg.map(duplicateAccessorFn)

  const duplicateIndexes: Map<TProperty, number[]> = values.reduce(
    (dupeMap, value, i) => {
      if (!value) {
        return dupeMap
      }

      const duplicates = dupeMap.get(value)
      if (duplicates) {
        dupeMap.set(value, [...duplicates, i])
      } else if (values.lastIndexOf(value) !== i) {
        dupeMap.set(value, [i])
      }
      return dupeMap
    },
    new Map<TProperty, number[]>(),
  )

  for (const duplicate of Array.from(duplicateIndexes.entries())) {
    for (const duplicateIndex of duplicate[1]) {
      ctx.addIssue({
        code: "custom",
        message: "No duplicates",
        path: [duplicateIndex, propertyPath],
      })
    }
  }
}
