import { Prisma } from "@prisma/client"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { AuthSession } from "@supabase/supabase-js"
import { NextApiRequest, NextApiResponse } from "next"
import { ConditionalKeys } from "type-fest"
import { z } from "zod"
import { FromZodErrorOptions, fromZodError } from "zod-validation-error"

import { getBypassPrismaClient } from "lib/prisma"
import { UserWithPharmacy, userWithPharmacy } from "types/models"

export type PrismaOrderByWithRelationInput = {
  [k: string]:
    | number
    | Prisma.SortOrder
    | Prisma.SortOrderInput
    | PrismaOrderByWithRelationInput
    | {
        _count?: Prisma.SortOrder
      }
    | PrismaOrderByWithRelationInput
  //| undefined
}

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

export type AppSession = {
  authSession: AuthSession
  appUser: UserWithPharmacy
}

export type NextApiHandlerWithSession<
  Data = any,
  RequireAuth extends boolean = true,
> = (
  req: NextApiRequestWithSession<RequireAuth>,
  res: NextApiResponse<Data>,
) => unknown | Promise<unknown>

export type NextApiRequestWithSession<RequireAuth extends boolean = true> =
  NextApiRequest &
    (RequireAuth extends true
      ? { session: AppSession }
      : { session?: AppSession })

export function withSession<
  ResponseData = any,
  RequireAuth extends boolean = false,
>(
  handler: NextApiHandlerWithSession<ResponseData, RequireAuth>,
  options: { requireAuth: false },
): NextApiHandlerWithSession<ResponseData, RequireAuth>
export function withSession<
  ResponseData = any,
  RequireAuth extends boolean = true,
>(
  handler: NextApiHandlerWithSession<ResponseData, RequireAuth>,
  options?: { requireAuth?: true },
): NextApiHandlerWithSession<ResponseData, RequireAuth>
export function withSession<
  ResponseData = any,
  RequireAuth extends boolean = boolean,
>(
  handler: NextApiHandlerWithSession<ResponseData, RequireAuth>,
  options: { requireAuth?: RequireAuth } = { requireAuth: true as RequireAuth },
): NextApiHandlerWithSession<ResponseData, RequireAuth> {
  const { requireAuth = true } = options ?? { requireAuth: true }

  return async (
    req: NextApiRequestWithSession<RequireAuth>,
    res: NextApiResponse<ResponseData>,
  ) => {
    try {
      const supabase = createPagesServerClient({ req, res })
      const {
        data: { session: authSession },
        error,
      } = await supabase.auth.getSession()
      if (!authSession && requireAuth) {
        throw error
      }

      if (authSession) {
        const appUser = await getBypassPrismaClient().user.findUniqueOrThrow({
          where: { id: authSession.user.id },
          ...userWithPharmacy,
        })

        req.session = { authSession, appUser }
      }

      return handler(req, res)
    } catch (error) {
      return sendJsonError(res, 401, "Authentication required")
    }
  }
}

export const getSession: (
  ...args: Parameters<typeof createPagesServerClient>
) => Promise<AppSession | null> = async (context, options) => {
  const supabase = createPagesServerClient(context, options)
  const {
    data: { session: authSession },
  } = await supabase.auth.getSession()

  if (!authSession) {
    return null
  }

  const appUser = await getBypassPrismaClient().user.findUniqueOrThrow({
    where: { id: authSession.user.id },
    ...userWithPharmacy,
  })

  return { authSession, appUser }
}
