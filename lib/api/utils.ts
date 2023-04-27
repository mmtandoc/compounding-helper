import { Prisma } from "@prisma/client"
import { NextApiResponse } from "next"
import { ConditionalExcept, ConditionalKeys } from "type-fest"
import { z } from "zod"
import { fromZodError } from "zod-validation-error"

export type PrismaOrderByWithRelationInput = Record<
  PropertyKey,
  | Prisma.SortOrder
  | {
      _count?: Prisma.SortOrder
    }
  | undefined
>

export type PrismaOrderByWithoutRelationInput<
  TOrderBy extends PrismaOrderByWithRelationInput,
> = ConditionalExcept<
  TOrderBy,
  | {
      _count?: Prisma.SortOrder
    }
  | undefined
>

export const parseSortQuery = <TOrderBy extends PrismaOrderByWithRelationInput>(
  query: Partial<{
    [key: string]: string | string[]
  }>,
): PrismaOrderByWithoutRelationInput<TOrderBy>[] | undefined => {
  //Query format: /users?sort=first_name:asc,age:desc
  if (!query?.sort) {
    return
  }

  const sortParameter = Array.isArray(query.sort) ? query.sort[0] : query.sort

  const isValid = (param: string) =>
    /^(?:\w+:(?:asc|desc),)?(?:\w+:(?:asc|desc))$/.test(param)

  if (!isValid(sortParameter)) {
    throw new Error("Invalid sort query")
  }

  return sortParameter
    .split(",")
    .map(
      (v) =>
        v.split(":") as [
          ConditionalKeys<TOrderBy, Prisma.SortOrder>,
          Prisma.SortOrder,
        ],
    )
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
 */
export const sendZodError = (
  res: NextApiResponse,
  zodError: z.ZodError,
  statusCode = 400,
) => {
  const validationError = fromZodError(zodError)
  sendJsonError(
    res,
    statusCode,
    validationError.message,
    validationError.details,
  )
}
