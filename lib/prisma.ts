import { ForbiddenError, subject } from "@casl/ability"
import { accessibleBy } from "@casl/prisma"
import { User as AppUser, Prisma, PrismaClient } from "@prisma/client"
import _ from "lodash"

import {
  AppAbility,
  AppActions,
  defineAbilityForUser,
} from "./auth/ability/appAbilities"
import { relationAbilityChecker } from "./auth/ability/utils"
import { uncapitalize } from "./utils"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

/* 
  Based on https://zenn.dev/sawachon/articles/c1c7fe658fe2c6
  and https://github.com/prisma/prisma-client-extensions/tree/main/row-level-security
*/
export function bypassRLS() {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const [, result] = await prisma.$transaction([
              prisma.$executeRaw`SELECT set_config('public.bypass_rls', 'on', TRUE)`,
              query(args),
            ])
            return result
          },
        },
      },
    }),
  )
}

export function forUser(userId: string) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        async $allOperations({ args, query }) {
          const [, result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('public.current_user_id', ${userId}, TRUE)`,
            query(args),
          ])
          return result
        },
      },
    }),
  )
}

export function forUserTx(userId: string) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      client: {
        $transaction: async (args: any) => {
          // トランザクション関数で
          if (typeof args === "function") {
            // Interactive transactionsの場合
            return prisma.$transaction(async (txClient) => {
              await txClient.$executeRaw`SELECT set_config('public.current_user_id', ${userId}, TRUE)`
              return args(txClient)
            })
          }
          const [, ...results] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('public.current_user_id', ${userId}, TRUE)`,
            ...args,
          ]) // Sequential　operationsの場合
          return results
        },
      },
    }),
  )
}

export function withCaslAbilities(user: AppUser) {
  const ability = defineAbilityForUser(user)
  return Prisma.defineExtension((client) =>
    client.$extends({
      query: {
        $allModels: {
          async update({ args, model, query }) {
            // Check if user has permission to update specific record
            const record = await (
              client[uncapitalize(model)] as any
            ).findUniqueOrThrow({
              where: args.where,
            })

            ForbiddenError.from(ability).throwUnlessCan(
              "update",
              subject(model, record),
            )

            // Check if user has ability to act on nested relations
            await relationAbilityChecker(
              model,
              ability,
              client as PrismaClient,
              args,
              true,
            )

            return query(args)
          },
          async create({ args, model, query }) {
            // Check if user has ability to act on nested relations
            await relationAbilityChecker(
              model,
              ability,
              client as PrismaClient,
              args,
              true,
            )

            ForbiddenError.from(ability).throwUnlessCan(
              "create",
              subject(model, args.data as any),
            )
            return query(args)
          },
          async createMany({ args, model, query }) {
            const items = !Array.isArray(args.data) ? [args.data] : args.data

            // Check if user try to create an element that is not allowed to create
            for (const item of items) {
              ForbiddenError.from(ability).throwUnlessCan(
                "create",
                subject(model, item as any),
              )
            }
            return query(args)
          },
          async updateMany({ args, model, query }) {
            // Check if user has ability to act on nested relations
            await relationAbilityChecker(
              model,
              ability,
              client as PrismaClient,
              args,
              true,
            )

            // Must coerce to 'any' as otherwise causes TS error "Expression produces a union type that is too complex to represent"
            //TODO: Try to fix TS error "Expression produces a union type that is too complex to represent"
            const records = await (client[uncapitalize(model)] as any).findMany(
              {
                ...args,
                where: {
                  AND: [
                    accessibleBy(ability, "update")[model] as any,
                    args.where,
                  ],
                },
              },
            )

            for (const record of records) {
              ForbiddenError.from(ability).throwUnlessCan(
                "update",
                subject(model, record),
              )
            }

            return query(args)
          },
          async upsert({ args, model, query }) {
            // Check if user has ability to act on nested relations
            await relationAbilityChecker(
              model,
              ability,
              client as PrismaClient,
              args,
              true,
            )

            // Must coerce to 'any' as otherwise causes TS error "Expression produces a union type that is too complex to represent"
            //TODO: Try to fix TS error "Expression produces a union type that is too complex to represent"
            const records = await (client[uncapitalize(model)] as any).findMany(
              {
                ...args,
                where: {
                  AND: [
                    accessibleBy(ability, "update")[model] as any,
                    args.where,
                  ],
                },
              },
            )

            // Check if user has permission to update existing records
            for (const record of records) {
              ForbiddenError.from(ability).throwUnlessCan(
                "update",
                subject(model, record),
              )
            }

            ForbiddenError.from(ability).throwUnlessCan("create", model)
            return query(args)
          },
          async delete({ args, model, query }) {
            // Check if user has permission to delete specific record
            // Must coerce to 'any' as otherwise causes TS error "Expression produces a union type that is too complex to represent"
            //TODO: Try to fix TS error "Expression produces a union type that is too complex to represent"
            const record = await (
              client[uncapitalize(model)] as any
            ).findUniqueOrThrow({
              where: args.where,
            })

            ForbiddenError.from(ability).throwUnlessCan(
              "delete",
              subject(model, record),
            )

            return query(args)
          },
          async deleteMany({ args, model, query }) {
            // Must coerce to 'any' as otherwise causes TS error "Expression produces a union type that is too complex to represent"
            //TODO: Try to fix TS error "Expression produces a union type that is too complex to represent"
            const records = await (client[uncapitalize(model)] as any).findMany(
              {
                ...args,
                where: {
                  AND: [
                    accessibleBy(ability, "delete")[model] as any,
                    args.where,
                  ],
                },
              },
            )

            for (const record of records) {
              ForbiddenError.from(ability).throwUnlessCan(
                "delete",
                subject(model, record),
              )
            }

            return query(args)
          },
          async findUnique({ args, model, query }) {
            const uniqueKeys = getUniqueWhereKeys(model)

            const uniqueWhere = _.pick(args.where, uniqueKeys)
            const nonUniqueWhere = _.omit(args.where, uniqueKeys)

            const findUniqueArgs = {
              ...args,
              where: {
                ...uniqueWhere,
                AND: nonUniqueWhere
                  ? [accessibleBy(ability, "read")[model], nonUniqueWhere]
                  : [accessibleBy(ability, "read")[model]],
              } as any,
            }
            return await query(findUniqueArgs)
          },
          async findUniqueOrThrow({ args, model, query }) {
            const uniqueKeys = getUniqueWhereKeys(model)

            const uniqueWhere = _.pick(args.where, uniqueKeys)
            const nonUniqueWhere = _.omit(args.where, uniqueKeys)

            const findUniqueArgs = {
              ...args,
              where: {
                ...uniqueWhere,
                AND: nonUniqueWhere
                  ? [accessibleBy(ability, "read")[model], nonUniqueWhere]
                  : [accessibleBy(ability, "read")[model]],
              } as any,
            }
            return await query(findUniqueArgs)
          },
          async findFirst({ args, model, query }) {
            return await query({
              ...args,
              where: whereAccessibleBy(args.where, ability, model) as any,
            })
          },
          async findMany({ args, model, query }) {
            return await query({
              ...args,
              where: whereAccessibleBy(args.where, ability, model) as any,
            })
          },
          async aggregate({ args, model, query }) {
            return query({
              ...args,
              where: whereAccessibleBy(args.where, ability, model) as any,
            })
          },
          async count({ args, model, query }) {
            return query({
              ...args,
              where: whereAccessibleBy(args.where, ability, model) as any,
            })
          },
          async groupBy({ args, model, query }) {
            return query({
              ...args,
              where: whereAccessibleBy(args.where, ability, model) as any,
            })
          },
        },
      },
    }),
  )
}

const getUniqueWhereKeys = (modelName: Prisma.ModelName) => {
  const dmmfModel = Prisma.dmmf.datamodel.models.find(
    (m) => m.name === modelName,
  )

  if (!dmmfModel) {
    throw new Error("Invalid model name")
  }

  const uniqueFieldNames = dmmfModel.fields
    .filter((f) => f.isUnique)
    .map((f) => f.name)

  const idFieldNames = dmmfModel.fields.filter((f) => f.isId).map((f) => f.name)

  const getCompoundFieldName = (
    input: Prisma.DMMF.PrimaryKey | Prisma.DMMF.uniqueIndex,
  ) => {
    return input.name ?? input.fields.join("_")
  }

  const uniqueIndexNames = dmmfModel.uniqueIndexes.map(getCompoundFieldName)
  const compositeKeyName = dmmfModel.primaryKey
    ? getCompoundFieldName(dmmfModel.primaryKey)
    : undefined

  return [
    ...uniqueFieldNames,
    ...idFieldNames,
    ...uniqueIndexNames,
    ...(compositeKeyName ? [compositeKeyName] : []),
  ]
}

function whereAccessibleBy(
  where: any,
  ability: AppAbility,
  model: Prisma.ModelName,
  action: AppActions = "read",
) {
  if (where) {
    return {
      AND: [accessibleBy(ability, action)[model], where],
    }
  }
  return accessibleBy(ability, action)[model]
}

function createExtendedPrisma() {
  const basePrisma = new PrismaClient({
    log: [
      { emit: "stdout", level: "query" },
      { emit: "stdout", level: "info" },
      { emit: "stdout", level: "warn" },
      { emit: "stdout", level: "error" },
      //{ emit: "event", level: "query" },
    ],
  })

  /* basePrisma.$on("query", (e) => {
    console.log("query - " + e.query)
    console.log("Params: " + e.params)
  }) */

  return basePrisma
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createExtendedPrisma>
}

export const prisma = globalForPrisma.prisma ?? createExtendedPrisma()

export function getUserPrismaClient(user: AppUser) {
  const client = prisma
    .$extends(withCaslAbilities(user))
    .$extends(forUser(user.id))

  // Forcibly override the `$transaction` function and apply the extension that sets user ID temporarily into DB config.
  client.$transaction = prisma
    .$extends(withCaslAbilities(user))
    .$extends(forUserTx(user.id)).$transaction

  return client
}

export function getBypassPrismaClient() {
  return prisma.$extends(bypassRLS())
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
