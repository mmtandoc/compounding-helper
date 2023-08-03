import { Prisma } from "@prisma/client"
import { NextApiResponse } from "next"
import { ConditionalExcept, ConditionalKeys } from "type-fest"
import { z } from "zod"
import { FromZodErrorOptions, fromZodError } from "zod-validation-error"

export type PrismaOrderByWithRelationInput = Record<
  string,
  | Prisma.SortOrder
  | Prisma.SortOrderInput
  | {
      _count?: Prisma.SortOrder
    }
  | undefined
>

export const parseSortQuery = <TOrderBy extends PrismaOrderByWithRelationInput>(
  query: Partial<Record<string, string | string[]>>,
): TOrderBy[] | undefined => {
  //Query format: /users?sort=first_name:asc,age:desc
  if (!query?.sort) {
    return
  }

  const sortQuerySchema = z
    .string()
    .transform((str) => str.split(","))
    .pipe(
      z
        .string()
        .regex(/^\w+:(?:asc|desc)$/)
        .transform(
          (sort) =>
            sort.split(":") as [
              ConditionalKeys<TOrderBy, Prisma.SortOrder>,
              Prisma.SortOrder,
            ],
        )
        .array(),
    )

  return sortQuerySchema
    .parse(query.sort)
    .map((e) => Object.fromEntries([e])) as any
}

/**
 * Sends a JSON error response with the specified status code, message, and details.
 *
 * @param {NextApiResponse} res - The Next.js HTTP response object.
 * @param {number} statusCode - The HTTP status code to set in the response.
 * @param {string} message - The error message to send in the response.
 * @param {unknown} [details] - Optional details about the error to send in the response.
 */
export const sendJsonError = (
  res: NextApiResponse,
  statusCode: number,
  message: string,
  details?: unknown,
) => res.status(statusCode).json({ code: statusCode, message, details })

/**
 * Sends a JSON error response with the details of a Zod validation error.
 *
 * @param {NextApiResponse} res - The Next.js HTTP response object.
 * @param {z.ZodError} zodError - The Zod validation error to send in the response.
 * @param {number} [statusCode=400] - The HTTP status code to set in the response. Defaults to 400.
 * @param {FromZodErrorOptions} [options] - Options for zod-validation-error
 */
export const sendZodError = (
  res: NextApiResponse,
  zodError: z.ZodError,
  statusCode = 400,
  options?: FromZodErrorOptions,
) => {
  const validationError = fromZodError(zodError, options)
  sendJsonError(
    res,
    statusCode,
    validationError.message,
    validationError.details,
  )
}
