import { Prisma } from "@prisma/client"

import { SdsFields, sdsSchema } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { SdsWithRelations } from "types/models"

import SdsHazardMapper from "./SdsHazardMapper"

const SdsMapper = {
  toFieldValues: (data: SdsWithRelations): SdsFields => {
    return sdsSchema.parse({
      id: data.id,
      pharmacyId: data.pharmacyId,
      productId: data.productId,
      chemicalId: data.product.chemicalId,
      hmisHazardLevel: data.hmisHealthHazard,
      revisionDate: toIsoDateString(data.revisionDate),
      hazards: data.healthHazards.map(SdsHazardMapper.toFieldValues),
      requireVentilation: data.requireVentilation,
    })
  },
  toModel: (
    values: SdsFields,
  ): Omit<Prisma.SDSUncheckedCreateInput, "healthHazards" | "ingredients"> => {
    return {
      id: values.id,
      pharmacyId: values.pharmacyId,
      productId: values.productId,
      hmisHealthHazard: values.hmisHazardLevel,
      requireVentilation: values.requireVentilation,
      revisionDate: new Date(values.revisionDate),
    }
  },
}

export default SdsMapper
