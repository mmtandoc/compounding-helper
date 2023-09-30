import { ForbiddenError, subject } from "@casl/ability"
import { Prisma, PrismaClient } from "@prisma/client"
import _ from "lodash"

import { uncapitalize } from "lib/utils"

import { AppAbility } from "./appAbilities"

// Based on https://github.com/twentyhq/twenty/blob/96865b0fec71d0a9f657f9b7f37d1946e83cf4fc/server/src/ability/ability.util.ts

type OperationType =
  | "create"
  | "connectOrCreate"
  | "upsert"
  | "createMany"
  | "set"
  | "disconnect"
  | "delete"
  | "connect"
  | "update"
  | "updateMany"
  | "deleteMany"

// in most case unique identifier is the id, but it can be something else...

type OperationAbilityChecker = (
  modelName: Prisma.ModelName,
  ability: AppAbility,
  prisma: PrismaClient,
  data: any,
  shouldThrow?: boolean,
) => Promise<boolean>

const createAbilityCheck: OperationAbilityChecker = async (
  modelName,
  ability,
  _,
  data,
  shouldThrow = false,
) => {
  // Handle all operations cases
  const items = data?.data
    ? !Array.isArray(data.data)
      ? [data.data]
      : data.data
    : !Array.isArray(data)
    ? [data]
    : data

  // Check if user try to create an element that is not allowed to create
  for (const item of items) {
    if (shouldThrow) {
      ForbiddenError.from(ability).throwUnlessCan(
        "read",
        subject(modelName, item),
      )
    } else if (!ability.can("create", subject(modelName, item))) {
      return false
    }
  }

  return true
}

const simpleAbilityCheck: OperationAbilityChecker = async (
  modelName,
  ability,
  prisma,
  data,
  shouldThrow = false,
) => {
  if (typeof data === "boolean") {
    return true
  }
  // Extract entity name from model name
  const entity = uncapitalize(modelName)
  //TODO: Fix boolean data types so that disconnects are possible
  if (typeof data === "boolean") {
    return true
  }
  // Handle all operations cases
  const operations = !Array.isArray(data) ? [data] : data
  // Handle where case
  const normalizedOperations = operations.map((op) =>
    op.where ? op.where : op,
  )

  // Force entity type because of Prisma typing
  const items = await (prisma[entity] as any).findMany({
    where: {
      OR: normalizedOperations,
    },
  })

  // Check if user try to connect an element that is not allowed to read
  for (const item of items) {
    if (shouldThrow) {
      ForbiddenError.from(ability).throwUnlessCan(
        "read",
        subject(modelName, item),
      )
    } else if (!ability.can("read", subject(modelName, item))) {
      return false
    }
  }

  return true
}

const operationAbilityCheckers: Record<OperationType, OperationAbilityChecker> =
  {
    create: createAbilityCheck,
    createMany: createAbilityCheck,
    upsert: simpleAbilityCheck,
    update: simpleAbilityCheck,
    updateMany: simpleAbilityCheck,
    delete: simpleAbilityCheck,
    deleteMany: simpleAbilityCheck,
    connectOrCreate: simpleAbilityCheck,
    connect: simpleAbilityCheck,
    disconnect: simpleAbilityCheck,
    set: simpleAbilityCheck,
  }

// Check relation nested abilities
export const relationAbilityChecker = async (
  modelName: Prisma.ModelName,
  ability: AppAbility,
  prisma: PrismaClient,
  args: any,
  shouldThrow = false,
) => {
  // Extract models from Prisma
  const models = Prisma.dmmf.datamodel.models
  // Find main model from options
  const mainModel = models.find((item) => item.name === modelName)

  if (!mainModel) {
    throw new Error("Main model not found")
  }

  // Loop over fields
  for (const field of mainModel.fields) {
    // Check if field is a relation
    if (field.relationName) {
      // Check if field is in args
      const operation = args.data?.[field.name] ?? args?.[field.name]

      if (operation) {
        // Extract operation name and value
        const operationType = Object.keys(operation)[0] as OperationType
        const operationValue = operation[operationType]

        // Get operation checker for the operation type
        const operationChecker = operationAbilityCheckers[operationType]

        if (!operationChecker) {
          throw new Error("Operation not found")
        }

        const parentData = args.data

        const relationData = operationValue?.data
          ? !Array.isArray(operationValue.data)
            ? [operationValue.data]
            : operationValue.data
          : !Array.isArray(operationValue)
          ? [operationValue]
          : operationValue

        // In order for ability rules with conditions depending on related records to work when using a nested "create"/"createMany",
        // we need to attempt to populate the relation fields with the parent's data
        // ? Look into a better way to handle this.
        const createDataWithRelations = relationData.map((data: any) =>
          populateDataRelations(field, parentData, mainModel, data),
        )

        // Check if operation is allowed
        const allowed = await operationChecker(
          field.type as Prisma.ModelName,
          ability,
          prisma,
          ["create", "createMany"].includes(operationType)
            ? createDataWithRelations
            : operationValue,
          shouldThrow,
        )

        if (!allowed) {
          return false
        }

        // For the 'create', 'connectOrCreate', 'upsert', 'update', and 'updateMany' operations,
        // we should also check the nested operations.
        if (
          [
            "create",
            "connectOrCreate",
            "upsert",
            "update",
            "updateMany",
          ].includes(operationType)
        ) {
          // Handle nested operations all cases

          const operationValues = !Array.isArray(operationValue)
            ? [operationValue]
            : operationValue

          // Loop over nested args
          for (const nestedArgs of operationValues) {
            const nestedCreateData =
              nestedArgs.create ?? nestedArgs.data ?? nestedArgs

            const nestedCreateAllowed = await relationAbilityChecker(
              field.type as Prisma.ModelName,
              ability,
              prisma,
              nestedCreateData,
              shouldThrow,
            )

            if (!nestedCreateAllowed) {
              return false
            }

            if (nestedArgs.update) {
              const nestedUpdateAllowed = await relationAbilityChecker(
                field.type as Prisma.ModelName,
                ability,
                prisma,
                nestedArgs.update,
                shouldThrow,
              )

              if (!nestedUpdateAllowed) {
                return false
              }
            }
          }
        }
      }
    }
  }

  return true
}

const isWhereInput = (input: any): boolean => {
  return Object.values(input).some((value) => typeof value === "object")
}

type ExcludeUnique<T> = T extends infer U
  ? "AND" extends keyof U
    ? U
    : never
  : never

/**
 * Convert a where unique input to a where input prisma
 * @param args Can be a where unique input or a where input
 * @returns whare input
 */
export const convertToWhereInput = <T>(
  where: T | undefined,
): ExcludeUnique<T> | undefined => {
  const input = where as any

  if (!input) {
    return input
  }

  // If it's already a WhereInput, return it directly
  if (isWhereInput(input)) {
    return input
  }

  // If not convert it to a WhereInput
  const whereInput: any = {}

  for (const key in input) {
    whereInput[key] = { equals: input[key] }
  }

  return whereInput as ExcludeUnique<T>
}

/**
 * Populates data relations for a Prisma model based on the provided information.
 *
 * @param relationField - The Prisma DMMF field representing the relation.
 * @param parentData - The data from the parent model.
 * @param parentModel - The main Prisma model.
 * @param createData - The data to create the model with.
 * @returns An object containing the `createData` with populated data relations.
 * @throws Error if the reversed relation cannot be found.
 */
function populateDataRelations(
  relationField: Prisma.DMMF.Field,
  parentData: any,
  parentModel: Prisma.DMMF.Model,
  createData: any,
) {
  // Find the reversed relation based on the provided relationField.
  const reversedRelation = Prisma.dmmf.datamodel.models
    .find((m) => m.name === relationField.type)
    ?.fields.find((f) => f.relationName === relationField.relationName)

  if (!reversedRelation) {
    throw new Error("Cannot find reversed relation")
  }

  // Create a mapping of relation fields from the reversed relation.
  const relationFieldsMap = new Map([
    ..._.zip<string, string>(
      reversedRelation.relationFromFields
        ? reversedRelation.relationFromFields
        : ([] as string[]),
      reversedRelation.relationToFields ?? ([] as string[]),
    ),
  ])

  const createDataWithRelation = {
    // Add the parent data, omitting other relations, to create data
    [reversedRelation.name]: _.omitBy(
      parentData,
      (_, key) =>
        parentModel.fields.find((f) => f.name === key)?.relationName !==
        undefined,
    ),
    ...createData,
  }

  // Assign additional relation field properties
  relationFieldsMap.forEach((to, from) => {
    if (from && to && Object.hasOwn(parentData, to)) {
      Object.assign(createDataWithRelation, {
        [from]: parentData[to],
      })
    }
  })

  return createDataWithRelation
}
