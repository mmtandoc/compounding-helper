/* eslint-disable @typescript-eslint/no-explicit-any */
import Zod, * as z from "zod"

export type ZodDeepNullPartial<T extends Zod.ZodTypeAny> =
  T extends Zod.ZodObject<infer Shape, infer Params, infer Catchall>
    ? Zod.ZodObject<
        {
          [k in keyof Shape]: Zod.ZodNullable<ZodDeepNullPartial<Shape[k]>>
        },
        Params,
        Catchall
      >
    : T extends Zod.ZodArray<infer Type, infer Card>
    ? Zod.ZodArray<ZodDeepNullPartial<Type>, Card>
    : T extends Zod.ZodOptional<infer Type>
    ? Zod.ZodOptional<ZodDeepNullPartial<Type>>
    : T extends Zod.ZodNullable<infer Type>
    ? Zod.ZodNullable<ZodDeepNullPartial<Type>>
    : T extends Zod.ZodTuple<infer Items>
    ? {
        [k in keyof Items]: Items[k] extends Zod.ZodTypeAny
          ? ZodDeepNullPartial<Items[k]>
          : never
      } extends infer PI
      ? PI extends Zod.ZodTupleItems
        ? Zod.ZodTuple<PI>
        : never
      : never
    : T

export function deepNullPartialify<T extends Zod.ZodTypeAny>(
  schema: T,
): ZodDeepNullPartial<T> {
  if (schema instanceof Zod.ZodObject) {
    const newShape: any = {}

    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key]
      newShape[key] = Zod.ZodNullable.create(deepNullPartialify(fieldSchema))
    }
    return new Zod.ZodObject({
      ...schema._def,
      shape: () => newShape,
    }) as any
  } else if (schema instanceof Zod.ZodArray) {
    return Zod.ZodArray.create(deepNullPartialify(schema.element)) as any
  } else if (schema instanceof Zod.ZodOptional) {
    return Zod.ZodOptional.create(deepNullPartialify(schema.unwrap())) as any
  } else if (schema instanceof Zod.ZodNullable) {
    return Zod.ZodNullable.create(deepNullPartialify(schema.unwrap())) as any
  } else if (schema instanceof Zod.ZodTuple) {
    return Zod.ZodTuple.create(
      schema.items.map((item: any) => deepNullPartialify(item)),
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
    console.log({ arg })
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
export const deepNullPartialifyWithIds = <
  T extends Zod.ZodRawShape,
  Mask extends {
    [k in keyof T]?: true
  },
>(
  schema: Zod.ZodObject<T>,
  ids?: Mask,
) =>
  deepNullPartialify(schema).merge(
    schema.pick(ids ?? (Object.hasOwn(schema.shape, "id") ? { id: true } : {})),
  )

export const utcDateZodString = z
  .string()
  .regex(/\d{4}-[01]\d-[0-3]\d/, "Date is invalid.") //UTC Date without time
