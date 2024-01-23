/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForbiddenError, subject } from "@casl/ability"
import { WhereInput, accessibleBy } from "@casl/prisma"
import { User as AppUser, Prisma, PrismaClient } from "@prisma/client"
import _ from "lodash"

import {
  AppAbility,
  AppActions,
  IncludesMap,
  defineAbilityForUser,
  getRequiredIncludes,
} from "./auth/ability/appAbilities"
import {
  createRelationFieldMap,
  getDmmfModel,
  relationAbilityChecker,
} from "./auth/ability/utils"
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

// TODO: Implement without module-scope variable (with AsyncLocalStorage?)
let sharedTxClient: any

export function forUserTx(userId: string) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      client: {
        $transaction: async (args: any) => {
          // トランザクション関数で
          if (typeof args === "function") {
            // Interactive transactionsの場合
            return prisma
              .$transaction(async (txClient) => {
                sharedTxClient = txClient
                await txClient.$executeRaw`SELECT set_config('public.current_user_id', ${userId}, TRUE)`
                return args(txClient)
              })
              .finally(() => {
                sharedTxClient = undefined
              })
          }
          //TODO: Support sequential operations transactions (issue #89)
          // Sequential operation transactions run out of order and can't be rolled back
          throw new Error(
            "Sequential operations transactions are not supported.",
          )
          /*
          const [, ...results] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('public.current_user_id', ${userId}, TRUE)`,
            ...args,
          ]) // Sequential　operationsの場合
          return results
          */
        },
      },
    }),
  )
}

export function withCaslAbilities(user: AppUser) {
  const ability = defineAbilityForUser(user)
  const requiredIncludes = getRequiredIncludes()
  return Prisma.defineExtension((client) =>
    client.$extends({
      query: {
        $allModels: {
          async update({ args, model, query, operation }) {
            client = sharedTxClient ?? client
            // Check if user has permission to update specific record
            const record = await (
              client[uncapitalize(model)] as any
            ).findUniqueOrThrow({
              include: requiredIncludes?.[model],
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
              operation,
              [{ model, where: args.where }],
              requiredIncludes,
              true,
            )

            return query(args)
          },
          async create({ args, model, query, operation }) {
            client = sharedTxClient ?? client
            // Check if user has ability to act on nested relations
            await relationAbilityChecker(
              model,
              ability,
              client as PrismaClient,
              args,
              operation,
              [{ model, where: args }],
              requiredIncludes,
              true,
            )

            // In order to check for create permission, we need to replace the relation fields with actual values
            const subjectData = await populateRequiredRelations(
              model,
              await populateNestedRelations(
                model,
                args,
                client as PrismaClient,
              ),
              requiredIncludes,
              client as PrismaClient,
            )

            ForbiddenError.from(ability).throwUnlessCan(
              "create",
              subject(model, subjectData as any),
            )
            return query(args)
          },
          async createMany({ args, model, query }) {
            const items = !Array.isArray(args.data) ? [args.data] : args.data

            // Check if user try to create an element that is not allowed to create
            for (const item of items) {
              const subjectData = await populateRequiredRelations(
                model,
                item,
                requiredIncludes,
                client as PrismaClient,
              )
              ForbiddenError.from(ability).throwUnlessCan(
                "create",
                subject(model, subjectData),
              )
            }
            return query(args)
          },
          async updateMany({ args, model, query, operation }) {
            client = sharedTxClient ?? client
            // Check if user has ability to act on nested relations
            await relationAbilityChecker(
              model,
              ability,
              client as PrismaClient,
              args,
              operation,
              [{ model, where: args.where }],
              requiredIncludes,
              true,
            )

            // Must coerce to 'any' as otherwise causes TS error "Expression produces a union type that is too complex to represent"
            //TODO: Try to fix TS error "Expression produces a union type that is too complex to represent"
            const records = await (client[uncapitalize(model)] as any).findMany(
              {
                //...args,
                include: requiredIncludes?.[model],
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
          async upsert({ args, model, query, operation }) {
            client = sharedTxClient ?? client
            // Check if user has ability to act on nested relations
            await relationAbilityChecker(
              model,
              ability,
              client as PrismaClient,
              args,
              operation,
              [{ model, where: args.where }],
              requiredIncludes,
              true,
            )

            // Must coerce to 'any' as otherwise causes TS error "Expression produces a union type that is too complex to represent"
            //TODO: Try to fix TS error "Expression produces a union type that is too complex to represent"

            const record = await (
              client[uncapitalize(model)] as any
            ).findUnique({
              include: requiredIncludes?.[model],
              where: args.where,
            })

            if (record) {
              ForbiddenError.from(ability).throwUnlessCan(
                "update",
                subject(model, record),
              )
            }

            ForbiddenError.from(ability).throwUnlessCan("create", model)
            return query(args)
          },
          async delete({ args, model, query }) {
            client = sharedTxClient ?? client
            // Check if user has permission to delete specific record
            // Must coerce to 'any' as otherwise causes TS error "Expression produces a union type that is too complex to represent"
            //TODO: Try to fix TS error "Expression produces a union type that is too complex to represent"
            const record = await (
              client[uncapitalize(model)] as any
            ).findUniqueOrThrow({
              include: requiredIncludes?.[model],
              where: args.where,
            })

            ForbiddenError.from(ability).throwUnlessCan(
              "delete",
              subject(model, record),
            )

            return query(args)
          },
          async deleteMany({ args, model, query }) {
            client = sharedTxClient ?? client
            // Must coerce to 'any' as otherwise causes TS error "Expression produces a union type that is too complex to represent"
            //TODO: Try to fix TS error "Expression produces a union type that is too complex to represent"
            const records = await (client[uncapitalize(model)] as any).findMany(
              {
                //...args,
                where: {
                  AND: [
                    accessibleBy(ability, "delete")[model] as any,
                    args.where,
                  ],
                },
                include: requiredIncludes?.[model],
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
              ..._.merge({ include: requiredIncludes?.[model] }, args),
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
              ..._.merge({ include: requiredIncludes?.[model] }, args),
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
  const dmmfModel = getDmmfModel(modelName)

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

/**
 * Creates an array of entries for connecting related records in Prisma.
 *
 * This function takes a Prisma field and a connect value as input and generates
 * an array of entries for connecting related records. It also considers any
 * mapped relation fields to create additional entries.
 *
 * TODO: Revise TSdoc
 *
 * @param field - The Prisma field representing the relation to connect.
 * @param connectValue - The value to connect related records.
 * @returns An array of entries for connecting related records, including the main
 * relation and any mapped relation fields.
 */
function createConnectSubjectEntries(
  field: Prisma.DMMF.Field,
  connectValue: any,
) {
  // Create a mapping of relation fields for the provided field.
  const relationFieldsMap = createRelationFieldMap(field)

  // Initialize an array to store the entries, starting with the main relation.
  const entries: any[] = [[field.name, connectValue]]

  relationFieldsMap.forEach((to, from) => {
    if (from && to && Object.hasOwn(connectValue, to)) {
      entries.push([from, connectValue[to]])
    }
  })

  return entries
}

export async function populateNestedRelations(
  model: Prisma.ModelName,
  args: any,
  client: PrismaClient,
): Promise<any> {
  const data = args.create ?? args.data ?? args

  const subjectDataEntries = []

  const dmmfModel = getDmmfModel(model)

  if (!dmmfModel) {
    throw new Error("DMMF model not found")
  }

  for (const field of dmmfModel.fields) {
    if (field.name in data) {
      const fieldData = data[field.name as keyof typeof data]
      // If field is a relation, then replace it with the nested create/connect data
      if (field.relationName) {
        //type ParentCreateInput = ModelArgs<typeof model, "create">["data"]
        const fieldModelName = field.type as Prisma.ModelName
        const operationType = Object.keys(fieldData)[0] as
          | "create"
          | "createMany"
          | "connect"
          | "connectOrCreate"
        const operationArgs = (fieldData as any)[operationType]

        switch (operationType) {
          case "create":
            subjectDataEntries.push([
              field.name,
              await populateNestedRelations(
                fieldModelName,
                operationArgs,
                client,
              ),
            ])
            break
          case "createMany": {
            const nestedCreateManyData = Array.isArray(operationArgs.data)
              ? operationArgs.data
              : [operationArgs.data]

            subjectDataEntries.push([field.name, nestedCreateManyData])

            /* for (const nestedCreateData of nestedCreateManyData) {
              subjectDataEntries.push([field.name, nestedCreateData])
            } */
            break
          }
          case "connect": {
            console.dir({ connectArgs: operationArgs }, { depth: null })

            console.log({
              pharmacies: await client.pharmacy.findMany(),
            })

            // Get record to connect
            const connectValue = await (
              client[uncapitalize(field.type as Prisma.ModelName)] as any
            ).findUniqueOrThrow({
              where: operationArgs as WhereInput<typeof model>,
            })

            subjectDataEntries.push(
              ...createConnectSubjectEntries(field, connectValue),
            )

            break
          }
          case "connectOrCreate": {
            // Check if record exists
            console.dir({ connectArgs: operationArgs.where }, { depth: null })
            const connectValue = await (
              client[uncapitalize(field.type as Prisma.ModelName)] as any
            ).findUnique({
              where: operationArgs.where as WhereInput<typeof model>,
            })

            if (connectValue) {
              subjectDataEntries.push(
                ...createConnectSubjectEntries(field, connectValue),
              )
            } else {
              subjectDataEntries.push([
                field.name,
                await populateNestedRelations(
                  fieldModelName,
                  operationArgs.create,
                  client,
                ),
              ])
            }
            break
          }
          default:
            subjectDataEntries.push([field.name, fieldData])
        }
      } else {
        subjectDataEntries.push([field.name, fieldData])
      }
    }
  }

  return Object.fromEntries(subjectDataEntries)
}

async function populateRequiredRelations(
  model: Prisma.ModelName,
  createData: any,
  requiredIncludes: IncludesMap,
  client: PrismaClient,
) {
  const dmmfModel = getDmmfModel(model)

  const requiredInclude = requiredIncludes[model]

  const result = _.cloneDeep(createData)

  for (const fieldName of Object.keys(requiredInclude ?? {})) {
    const relationField = dmmfModel?.fields.find((f) => f.name === fieldName)
    if (!relationField) {
      continue
    }
    const relationModel = relationField.type as Prisma.ModelName

    const scalarFieldNameMapper = new Map(
      _.zip(
        relationField.relationFromFields,
        relationField.relationToFields,
      ) as any,
    )

    const relationWhere = _.mapKeys(
      _.pick(createData, relationField.relationFromFields ?? []),
      (_, key) => scalarFieldNameMapper.get(key),
    )

    const relationData = await (
      client[uncapitalize(relationModel)] as any
    ).findUniqueOrThrow({
      include: requiredIncludes?.[relationModel],
      where: relationWhere,
    })

    result[fieldName] = relationData
  }

  return result
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

function createExtendedPrisma<
  TOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
>(options?: TOptions) {
  const basePrisma = new PrismaClient({
    errorFormat: "pretty",
    log: [
      /* { emit: "stdout", level: "query" },
      { emit: "stdout", level: "info" }, */
      { emit: "stdout", level: "warn" },
      { emit: "stdout", level: "error" },
      //{ emit: "event", level: "query" },
    ],
    ...options,
  })

  /* basePrisma.$on("query", (e) => {
    console.log("query - " + e.query)
    console.log("Params: " + e.params)
  }) */

  return basePrisma
}

type ExtendedPrismaClient = ReturnType<typeof createExtendedPrisma>

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient
  bypassPrisma: ExtendedPrismaClient
}

export let prisma: ExtendedPrismaClient
export let bypassPrisma: ExtendedPrismaClient

if (typeof window === "undefined") {
  prisma = globalForPrisma.prisma ?? createExtendedPrisma()
  bypassPrisma =
    globalForPrisma.bypassPrisma ??
    createExtendedPrisma({
      //TODO: Upgrade to prisma 5.2.0, and use "datasourceUrl" instead
      datasources: { db: { url: process.env?.DATABASE_URL } },
    })

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
    globalForPrisma.bypassPrisma = bypassPrisma
  }
}

export function getUserPrismaClient(user: AppUser) {
  const client = prisma
    .$extends(forUser(user.id))
    .$extends(withCaslAbilities(user))

  // Forcibly override the `$transaction` function and apply the extension that sets user ID temporarily into DB config.
  client.$transaction = prisma
    .$extends(withCaslAbilities(user))
    .$extends(forUserTx(user.id)).$transaction

  return client
}

export function getBypassPrismaClient() {
  return bypassPrisma
}
