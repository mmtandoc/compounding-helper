import { Prisma, SDS } from "@prisma/client"
import { SetOptional } from "type-fest"
import { sdsSchema, SdsFields } from "lib/fields"
import { SdsWithRelations } from "types/models"
import SdsHazardMapper from "./SdsHazardMapper"

const SdsMapper = {
  toFieldValues: (data: SdsWithRelations): SdsFields => {
    return sdsSchema.parse({
      id: data.id,
      productId: data.productId,
      chemicalId: data.product.chemicalId,
      hmisHazardLevel: data.hmisHealthHazard,
      revisionDate: data.revisionDate.toLocaleDateString("en-CA"),
      hazards: data.healthHazards.map(SdsHazardMapper.toFieldValues),
      requireVentilation: data.requireVentilation,
      filename: data.filename,
    })
  },
  toModel: (
    values: SdsFields,
  ): Omit<Prisma.SDSUncheckedCreateInput, "healthHazards" | "ingredients"> => {
    return {
      id: values.id ?? undefined,
      productId: values.productId,
      hmisHealthHazard: values.hmisHazardLevel,
      requireVentilation: values.requireVentilation,
      revisionDate: values.revisionDate,
      filename: values.filename,
    }
  },
}

export default SdsMapper
