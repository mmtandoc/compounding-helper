import { Prisma } from "@prisma/client"
import { productSchema, ProductFields } from "lib/fields"
import { ProductAll } from "types/models"

const ProductMapper = {
  toFieldValues: (data: ProductAll): ProductFields => {
    return productSchema.parse({
      id: data.id,
      name: data.name,
      chemicalId: data.chemicalId,
      vendorId: data.vendorId,
    })
  },

  toModel: (values: ProductFields): Prisma.ProductUncheckedCreateInput => {
    return {
      id: values.id ?? undefined,
      name: values.name,
      chemicalId: values.chemicalId,
      vendorId: values.vendorId,
    }
  },
}

export default ProductMapper
