import { ForbiddenError, subject } from "@casl/ability"
import {
  ModelName,
  WhereInput, // eslint-disable-next-line import/no-unresolved
} from "@casl/prisma/dist/types/prismaClientBoundTypes"
import { Prisma, PrismaClient } from "@prisma/client"
import { DMMF } from "@prisma/client/runtime/library"
import _ from "lodash"

import { populateNestedRelations } from "lib/prisma"
import { uncapitalize } from "lib/utils"

import { AppAbility, IncludesMap } from "./appAbilities"

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
  operationType: OperationType,
  parentWhere: any,
  requiredIncludes?: IncludesMap, // Include clauses for each model required for permission checks
  isNested?: boolean,
  shouldThrow?: boolean,
) => Promise<boolean>

const createAbilityCheck: OperationAbilityChecker = async (
  modelName,
  ability,
  prisma,
  data,
  operationType,
  _parentWhere,
  requiredIncludes,
  isNested = false,
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
    const itemWithRelations = await populateNestedRelations(
      modelName,
      item,
      prisma,
    )

    if (shouldThrow) {
      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        subject(modelName, itemWithRelations),
      )
    } else if (!ability.can("create", subject(modelName, itemWithRelations))) {
      return false
    }
  }

  return true
}

const simpleAbilityCheck: OperationAbilityChecker = async (
  modelName,
  ability,
  prisma,
  arg,
  operationType,
  parentWhere,
  requiredIncludes,
  isNested = false,
  shouldThrow = false,
) => {
  //TODO: Fix boolean data types so that disconnects are possible
  if (typeof arg === "boolean") {
    return true
  }
  // Extract entity name from model name
  const entity = uncapitalize(modelName)

  // Handle all operations cases
  const operations = !Array.isArray(arg) ? [arg] : arg

  // Handle where clause
  const normalizedOperations = operations.map((op) => {
    //TODO: Fix retrieval of the where clause
    if (isNested) {
      if (operationType === "delete") {
        return op
      }
      return op?.where
    }
    return op.where ?? op
  })

  const flattenedOperations = normalizedOperations.map((op) =>
    flattenCompoundKeys(modelName, op),
  )

  const where = {
    AND: [
      {
        OR: flattenedOperations,
      },
      flattenCompoundKeys(modelName, parentWhere),
    ],
  }

  // Force entity type because of Prisma typing
  const items = await (prisma[entity] as any).findMany({
    include: requiredIncludes?.[modelName],
    where,
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
    upsert: simpleAbilityCheck, //async () => true,
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
  operationType: OperationType,
  nestedPath: { field?: DMMF.Field; model: Prisma.ModelName; where: any }[],
  requiredIncludes?: IncludesMap, // Include clauses for each model required for permission checks
  shouldThrow = false,
) => {
  // Get main Prisma DMMF model
  const mainModel = getDmmfModel(modelName)

  if (!mainModel) {
    throw new Error("Main model not found")
  }

  // Loop over fields of the model
  for (const field of mainModel.fields) {
    // Check if field is a relation
    if (field.relationName) {
      // Check if field is in args
      const nestedOperation = args.data?.[field.name] ?? args?.[field.name]

      if (nestedOperation) {
        // Extract operation name and value
        const nestedOperationType = Object.keys(
          nestedOperation,
        )[0] as OperationType
        const operationValue = nestedOperation[nestedOperationType]

        // Get operation checker for the operation type
        const operationChecker = operationAbilityCheckers[nestedOperationType]

        if (!operationChecker) {
          throw new Error("Operation not found")
        }

        let parentData = args.data ?? args

        const relationData = operationValue?.data
          ? !Array.isArray(operationValue.data)
            ? [operationValue.data]
            : operationValue.data
          : !Array.isArray(operationValue)
          ? [operationValue]
          : operationValue

        let operationData = operationValue

        if (["create", "createMany"].includes(nestedOperationType)) {
          // In order for ability rules with conditions depending on related records to work when using a nested "create"/"createMany",
          // we need to attempt to populate the relation fields with the parent's data

          // If a where clause is given, this means that the new record should be linked to an existing record, so we can get the "parentData" directly from the DB
          if (args.where) {
            parentData = await (
              prisma[uncapitalize(modelName)] as any
            ).findUnique({
              include: requiredIncludes?.[modelName],
              where: args.where,
            })
          }

          // ? Look into a better way to handle this.
          const createDataWithRelations = relationData.map((data: any) =>
            populateDataRelations(field, parentData, mainModel, data),
          )
          operationData = createDataWithRelations
        }

        // Check if operation is allowed
        const allowed = await operationChecker(
          field.type as Prisma.ModelName,
          ability,
          prisma,
          operationData,
          nestedOperationType,
          createParentWhere([
            ...nestedPath,
            {
              field,
              model: field.type as ModelName,
              where: operationData?.where, //! Won't work with some nested operations where the "where" is at the top-level
            },
          ]),
          requiredIncludes,
          true,
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
          ].includes(nestedOperationType)
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
              nestedOperationType,
              [
                ...nestedPath,
                {
                  field,
                  model: field.type as ModelName,
                  where: nestedCreateData?.where,
                },
              ],
              requiredIncludes,
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
                nestedOperationType,
                [
                  ...nestedPath,
                  {
                    field,
                    model: field.type as ModelName,
                    where: nestedArgs.update?.where,
                  },
                ],
                requiredIncludes,
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
 * @returns where input
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
export function populateDataRelations(
  relationField: Prisma.DMMF.Field,
  parentData: any,
  parentModel: Prisma.DMMF.Model,
  createData: any,
) {
  // Find the reversed relation based on the provided relationField.
  const reversedRelation = getReversedRelation(relationField)

  // Create a mapping of relation fields from the reversed relation.
  const relationFieldsMap = createRelationFieldMap(reversedRelation)

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

function getReversedRelation(relationField: Prisma.DMMF.Field) {
  const reversedRelation = getDmmfModel(
    relationField.type as Prisma.ModelName, // Due to being a relation field, the type should be a data model.
  )?.fields.find((f) => f.relationName === relationField.relationName)

  if (!reversedRelation) {
    throw new Error("Cannot find reversed relation")
  }

  return reversedRelation
}

//TODO: Move to prisma util file
export function createRelationFieldMap(relation: Prisma.DMMF.Field) {
  return new Map([
    ..._.zip<string, string>(
      relation.relationFromFields
        ? relation.relationFromFields
        : ([] as string[]),
      relation.relationToFields ?? ([] as string[]),
    ),
  ])
}

// If provided operations are UniqueWhereInputs, they can contain multi-field unique attributes,
// which have to be flattened before performing a findMany query
export function flattenCompoundKeys<TModel extends Prisma.ModelName>(
  modelName: TModel,
  where: WhereInput<TModel>,
) {
  const getCompoundFieldName = (
    field: Prisma.DMMF.uniqueIndex | Prisma.DMMF.PrimaryKey,
  ) => (field.name ? field.name : field.fields.join("_"))

  const dmmfModel = getDmmfModel(modelName)

  if (!dmmfModel) {
    throw new Error("DMMF model not found")
  }

  const compoundFields: (Prisma.DMMF.uniqueIndex | Prisma.DMMF.PrimaryKey)[] =
    dmmfModel.uniqueIndexes

  if (dmmfModel.primaryKey) compoundFields.push(dmmfModel.primaryKey)

  const compoundFieldNames = compoundFields.map(getCompoundFieldName)

  const flatWhere = _.cloneDeep(where)

  if (!flatWhere) {
    return flatWhere
  }

  for (const [fieldName, value] of Object.entries(where ?? {})) {
    if (compoundFieldNames.includes(fieldName)) {
      // Flatten compound field
      Object.assign(flatWhere, value)
      delete (flatWhere as any)[fieldName]
    } else {
      const field = dmmfModel.fields.find((f) => f.name === fieldName)
      if (field && field.relationName) {
        ;(flatWhere as any)[fieldName] = flattenCompoundKeys(
          field.type as Prisma.ModelName,
          value,
        )
      }
    }
  }

  return flatWhere
}

export function getDmmfModel(modelName: Prisma.ModelName) {
  return Prisma.dmmf.datamodel.models.find((item) => item.name === modelName)
}

export function getIdFields(
  modelName: Prisma.ModelName,
  throwIfNotFound = false,
) {
  const dmmfModel = getDmmfModel(modelName)

  if (!dmmfModel) {
    throw new Error(`DMMF model for ${modelName} not found`)
  }

  let fields = dmmfModel.fields
  if (!fields) {
    if (throwIfNotFound) {
      throw new Error(`Unable to load fields for ${modelName}`)
    } else {
      fields = []
    }
  }
  const result = fields.filter((f) => f.isId)
  if (result.length === 0 && throwIfNotFound) {
    throw new Error(`model ${modelName} does not have an id field`)
  }
  return result
}

/**
 * Generates a parent where clause by merging the where properties of each item in the nestedPath array.
 *
 * @param nestedPath - An array of objects containing information about the nested path.
 * @return The parentWhere object.
 */
function createParentWhere(
  nestedPath: {
    field?: Prisma.DMMF.Field | undefined
    model: Prisma.ModelName
    where: any
  }[],
) {
  const parentWhere: any = {}

  let path: string[] = []

  // Iterate over each item in the nestedPath array in reverse order
  for (const item of nestedPath.toReversed()) {
    if (path.length > 0) {
      // Merge the where property of the item into the parentWhere object at the corresponding path
      _.set(
        parentWhere,
        path,
        Object.assign(_.get(parentWhere, path), item.where ?? {}),
      )
    } else {
      // If it's the first item, assign the where property directly to the parentWhere object
      Object.assign(parentWhere, item.where ?? {})
    }

    const reversedRelation = item.field
      ? getReversedRelation(item.field)
      : undefined

    if (reversedRelation) {
      const key = reversedRelation.name
      path = [...path, key]

      if (reversedRelation.isList) {
        // Use the "some" operator to filter the nested list
        _.set(parentWhere, path, { some: {} })
        path = [...path, "some"]
      } else {
        _.set(parentWhere, path, {})
      }
    }
  }

  return parentWhere
}
