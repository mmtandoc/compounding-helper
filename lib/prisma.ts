import { User as AppUser, Prisma, PrismaClient } from "@prisma/client"

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
  const client = prisma.$extends(forUser(user.id))
  client.$transaction = prisma.$extends(forUserTx(user.id)).$transaction
  return client
}

export function getBypassPrismaClient() {
  return prisma.$extends(bypassRLS())
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
