import { HazardCategoryToSDS } from "@prisma/client"
import { SetOptional } from "type-fest"

import { HazardFields } from "lib/fields"
import { SdsWithRelations } from "types/models"

const SdsHazardMapper = {
  toFieldValues: (data: SdsWithRelations["healthHazards"][0]): HazardFields => {
    let categoryId: HazardFields["categoryId"]
    let subcategoryId: HazardFields["subcategoryId"]

    if (data.hazardCategory.parentCategory === null) {
      categoryId = data.hazardCategoryId
      subcategoryId = null
    } else {
      categoryId = data.hazardCategory.parentCategory.id
      subcategoryId = data.hazardCategoryId
    }

    return {
      id: data.id,
      classId: data.hazardCategory.hazardClassId,
      categoryId,
      subcategoryId,
      additionalInfo: data.additionalInfo ?? undefined,
    }
  },
  toModel: (
    values: HazardFields,
  ): Omit<SetOptional<HazardCategoryToSDS, "id">, "sdsId"> => {
    return {
      id: values.id ?? undefined,
      hazardCategoryId: values.subcategoryId
        ? values.subcategoryId
        : (values.categoryId as number),
      additionalInfo: values.additionalInfo ?? null,
    }
  },
}

export default SdsHazardMapper
