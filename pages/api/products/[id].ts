import { NextApiRequest, NextApiResponse } from "next"
import * as z from "zod"

import { sendJsonError, sendZodError } from "lib/api/utils"
import { ProductFields, productSchema } from "lib/fields"
import ProductMapper from "lib/mappers/ProductMapper"
import { prisma } from "lib/prisma"
import { ApiBody } from "types/common"
import { ProductAll, productAll } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<ProductAll | undefined>>,
) {
  const { method } = req

  const results = querySchema.safeParse(req.query)

  if (!results.success) {
    return sendZodError(res, results.error, 400, { prefix: "Invalid ID" })
  }

  const id = results.data.id

  switch (method) {
    case "GET": {
      let product
      try {
        product = await getProductById(id)
      } catch (error) {
        console.log(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      if (product === null) {
        return sendJsonError(res, 404, `Product ${id} not found.`)
      }

      return res.status(200).json(product)
    }

    case "PUT": {
      let fields
      try {
        fields = productSchema.parse(req.body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      let updatedProduct
      try {
        updatedProduct = await updateProductById(id, fields)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(updatedProduct)
    }
    case "DELETE": {
      try {
        await deleteProductById(id)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(204).send(undefined)
    }
    default:
      sendJsonError(
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]),
        405,
        `Method ${method} Not Allowed`,
      )
      break
  }
}

export const getProductById = async (id: number) =>
  prisma.product.findUnique({
    where: { id },
    ...productAll,
  })

export const updateProductById = async (id: number, values: ProductFields) =>
  prisma.product.update({
    where: { id },
    data: ProductMapper.toModel(values),
    ...productAll,
  })

export const deleteProductById = async (id: number) =>
  prisma.product.delete({ where: { id } })
