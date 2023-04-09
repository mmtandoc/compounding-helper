import { Prisma } from "@prisma/client"
import { ConditionalExcept, ConditionalKeys } from "type-fest"

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
