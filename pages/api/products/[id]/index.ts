import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { ProductAll, productAll } from "types/models"
import { ApiBody } from "types/common"
import { ProductFields } from "types/fields"
import ProductMapper from "lib/mappers/ProductMapper"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<ProductAll | undefined>>,
) {
  const { query, method } = req

  const id = parseInt(query.id as string)

  if (isNaN(id)) {
    res.status(500).json({
      error: { code: 400, message: "Risk assessment ID must be integer." },
    })
    return
  }

  //TODO: Implement other User methods
  switch (method) {
    case "GET": {
      let product
      try {
        product = await getProductById(id)
      } catch (error) {
        //TODO: HANDLE ERROR
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      if (product === null) {
        res.status(404).json({
          error: { code: 404, message: `Product ${id} not found.` },
        })
        return
      }

      res.status(200).json(product)
      return
    }

    case "PUT": {
      let updatedProduct
      try {
        updatedProduct = await updateProductById(id, req.body)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(updatedProduct)
    }
    case "DELETE": {
      try {
        await deleteProductById(id)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(204).send(undefined)
      return
    }
    default:
      res
        .setHeader("Allow", ["GET", "PUT", "DELETE"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
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
