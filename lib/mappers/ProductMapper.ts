import { Prisma } from "@prisma/client"

import { ProductFields, productSchema } from "lib/fields"
import { ProductAll } from "types/models"

const ProductMapper = {
  toFieldValues: (data: ProductAll): ProductFields => {
    return productSchema.parse({
      id: data.id,
      pharmacyId: data.pharmacyId,
      name: data.name,
      chemicalId: data.chemicalId,
      vendorId: data.vendorId,
    })
  },

  toModel: (values: ProductFields): Prisma.ProductUncheckedCreateInput => {
    return {
      id: values.id,
      pharmacyId: values.pharmacyId,
      name: values.name,
      chemicalId: values.chemicalId,
      vendorId: values.vendorId,
    }
  },
}

export default ProductMapper
