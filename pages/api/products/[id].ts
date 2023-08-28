import { Prisma } from "@prisma/client"
import { User as AuthUser } from "@supabase/supabase-js"
import * as z from "zod"

import { sendJsonError, sendZodError, withSession } from "lib/api/utils"
import { ProductFields, productSchema } from "lib/fields"
import ProductMapper from "lib/mappers/ProductMapper"
import { getUserPrismaClient } from "lib/prisma"
import { ApiBody } from "types/common"
import { ProductAll, productAll } from "types/models"

const querySchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

const handler = withSession<ApiBody<ProductAll | undefined>>(
  async (req, res) => {
    const { method, session } = req

    const results = querySchema.safeParse(req.query)

    if (!results.success) {
      return sendZodError(res, results.error, 400, { prefix: "Invalid ID" })
    }

    const id = results.data.id

    switch (method) {
      case "GET": {
        let product
        try {
          product = await getProductById(session.user, id)
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
          updatedProduct = await updateProductById(session.user, id, fields)
        } catch (error) {
          console.error(error)
          return sendJsonError(res, 500, "Encountered error with database.")
        }

        return res.status(200).json(updatedProduct)
      }
      case "DELETE": {
        try {
          await deleteProductById(session.user, id)
        } catch (error) {
          console.error(error)
          // Unable to delete due to existing reference
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
          ) {
            return sendJsonError(
              res,
              409,
              "Unable to delete due to product being referenced by other records (i.e., SDS Summaries).",
            )
          }

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
  },
)

export default handler

export const getProductById = async (user: AuthUser, id: number) =>
  getUserPrismaClient(user).product.findUnique({
    where: { id },
    ...productAll,
  })

export const updateProductById = async (
  user: AuthUser,
  id: number,
  values: ProductFields,
) =>
  getUserPrismaClient(user).product.update({
    where: { id },
    data: ProductMapper.toModel(values),
    ...productAll,
  })

export const deleteProductById = async (user: AuthUser, id: number) =>
  getUserPrismaClient(user).product.delete({ where: { id } })
