import { SDS } from "@prisma/client"
import { SetOptional } from "type-fest"
import { SdsFields } from "types/fields"
import { SdsWithRelations } from "types/models"

const toFieldValues = (data: SdsWithRelations): SdsFields => {
  return {
    id: data.id,
    productId: data.productId,
    chemicalId: data.product.chemicalId,
    hmisHazardLevel: data.hmisHealthHazard,
    revisionDate: data.revisionDate.toLocaleDateString("en-CA"),
    hazards: data.healthHazards.map((h) => {
      let categoryId
      let subcategoryId

      if (h.hazardCategory.parentCategory === null) {
        categoryId = h.hazardCategoryId
        subcategoryId = null
      } else {
        categoryId = h.hazardCategory.parentCategory.id
        subcategoryId = h.hazardCategoryId
      }

      return {
        id: h.id,
        classId: h.hazardCategory.hazardClassId,
        categoryId,
        subcategoryId,
        additionalInfo: h.additionalInfo,
      }
    }),
    requireVentilation: data.requireVentilation,
  }
}

const toModel = (values: SdsFields): SetOptional<SDS, "id" | "updatedAt"> => {
  return {
    id: values.id ?? undefined,
    productId: values.productId,
    hmisHealthHazard: values.hmisHazardLevel,
    requireVentilation: values.requireVentilation,
    revisionDate: new Date(values.revisionDate),
    filename: "N/A",
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { toFieldValues, toModel }
