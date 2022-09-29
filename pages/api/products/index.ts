import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { Prisma, Product } from "@prisma/client"
import { ProductAll, productAll } from "types/models"
import { ProductFields } from "types/fields"
import ProductMapper from "lib/mappers/ProductMapper"
import { ApiBody } from "types/common"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<ProductAll[] | ProductAll>>,
) {
  const { query, method } = req

  switch (method) {
    case "GET": {
      const filters: Prisma.ProductWhereInput = {}

      if (query.chemicalId) {
        if (typeof query.chemicalId === "string") {
          filters.chemicalId = {
            equals: parseInt(query.chemicalId),
          }
        } else {
          filters.chemicalId = {
            in: query.chemicalId.map((id) => parseInt(id)),
          }
        }
      }

      let products

      try {
        products = await getProducts(filters)
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(products)
      return
    }
    case "POST": {
      const fields: ProductFields = req.body

      let result
      try {
        result = await createProduct(fields)
      } catch (error) {
        //TODO: HANDLE ERROR
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(result)
      return
    }
    default:
      res
        .setHeader("Allow", ["GET", "POST"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
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
