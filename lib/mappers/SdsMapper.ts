import { SDS } from "@prisma/client"
import { SetOptional } from "type-fest"
import { SdsFields } from "types/fields"
import { SdsWithRelations } from "types/models"
import SdsHazardMapper from "./SdsHazardMapper"

const SdsMapper = {
  toFieldValues: (data: SdsWithRelations): SdsFields => {
    return {
      id: data.id,
      productId: data.productId,
      chemicalId: data.product.chemicalId,
      hmisHazardLevel: data.hmisHealthHazard,
      revisionDate: data.revisionDate.toLocaleDateString("en-CA"),
      hazards: data.healthHazards.map(SdsHazardMapper.toFieldValues),
      requireVentilation: data.requireVentilation,
    }
  },
  toModel: (values: SdsFields): SetOptional<SDS, "id" | "updatedAt"> => {
    return {
      id: values.id ?? undefined,
      productId: values.productId,
      hmisHealthHazard: values.hmisHazardLevel,
      requireVentilation: values.requireVentilation,
      revisionDate: new Date(values.revisionDate),
      filename: "N/A",
    }
  },
}

export default SdsMapper
