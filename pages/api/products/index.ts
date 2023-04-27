import { Prisma } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import * as z from "zod"

import { sendJsonError, sendZodError } from "lib/api/utils"
import { ProductFields, productSchema } from "lib/fields"
import ProductMapper from "lib/mappers/ProductMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { ProductAll, productAll } from "types/models"

const querySchema = z.object({
  chemicalId: z.string().pipe(z.coerce.number()).optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<ProductAll[] | ProductAll>>,
) {
  const { query, method } = req

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
        products = await getProducts(filters)
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
        result = await createProduct(fields)
      } catch (error) {
        //TODO: HANDLE ERROR
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
}

export const getProducts = async (where?: Prisma.ProductWhereInput) =>
  await prisma.product.findMany({
    where,
    orderBy: { id: "asc" },
    ...productAll,
  })

export const createProduct = async (values: ProductFields) =>
  await prisma.product.create({
    data: ProductMapper.toModel(values),
    ...productAll,
  })
