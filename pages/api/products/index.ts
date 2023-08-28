import { Prisma } from "@prisma/client"
import { User as AuthUser } from "@supabase/supabase-js"
import * as z from "zod"

import { sendJsonError, sendZodError, withSession } from "lib/api/utils"
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
        products = await getProducts(session.user, filters)
      } catch (error) {
        console.error(error)
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
        result = await createProduct(session.user, fields)
      } catch (error) {
        console.error(error)
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
  user: AuthUser,
  where?: Prisma.ProductWhereInput,
) =>
  await getUserPrismaClient(user).product.findMany({
    where,
    orderBy: { id: "asc" },
    ...productAll,
  })

export const createProduct = async (user: AuthUser, values: ProductFields) =>
  await getUserPrismaClient(user).product.create({
    data: ProductMapper.toModel(values),
    ...productAll,
  })
