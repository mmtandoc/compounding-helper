import { ForbiddenError } from "@casl/ability"
import { Prisma } from "@prisma/client"
import * as z from "zod"

import {
  AppSession,
  sendForbiddenError,
  sendJsonError,
  sendZodError,
  withSession,
} from "lib/api/utils"
import { ProductFields, productSchema } from "lib/fields"
import ProductMapper from "lib/mappers/ProductMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ProductAll, productAll } from "types/models"

const querySchema = z.object({
  chemicalId: z.string().pipe(z.coerce.number()).optional(),
})

const handler = withSession<ProductAll[] | ProductAll>(async (req, res) => {
  const { query, method, session } = req

  switch (method) {
    case "GET": {
      const filters: Prisma.ProductWhereInput = {}

      const results = querySchema.safeParse(query)

      if (!results.success) {
        return sendZodError(res, results.error)
      }

      const chemicalId = results.data.chemicalId

      if (chemicalId) {
        filters.chemicalId = { equals: chemicalId }
      }

      let products

      try {
        products = await getProducts(session, filters)
      } catch (error) {
        console.error(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(products)
    }
    case "POST": {
      let fields
      try {
        fields = productSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let result
      try {
        result = await createProduct(session, fields)
      } catch (error) {
        console.error(error)
        if (error instanceof ForbiddenError) {
          return sendForbiddenError(res, error)
        }
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res
        .setHeader("Location", `/products/${result.id}`)
        .status(201)
        .json(result)
    }
    default:
      sendJsonError(
        res.setHeader("Allow", ["GET", "POST"]),
        405,
        `Method ${method} Not Allowed`,
      )
      break
  }
})

export default handler

export const getProducts = async (
  session: AppSession,
  where?: Prisma.ProductWhereInput,
) =>
  await getUserPrismaClient(session.appUser).product.findMany({
    where,
    orderBy: { id: "asc" },
    ...productAll,
  })

export const createProduct = async (
  session: AppSession,
  values: ProductFields,
) =>
  await getUserPrismaClient(session.appUser).product.create({
    data: ProductMapper.toModel(values),
    ...productAll,
  })
