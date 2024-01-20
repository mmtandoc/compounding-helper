import { AdditionalChemicalInfo, Prisma } from "@prisma/client"

import { ChemicalFields, chemicalSchema } from "lib/fields"
import { GetElementType } from "types/util"

type AdditionalChemicalInfoFields = GetElementType<
  ChemicalFields["additionalInfo"]
>

const AdditionalChemicalInfoMapper = {
  toFieldValues: (
    data: AdditionalChemicalInfo,
  ): AdditionalChemicalInfoFields => {
    return chemicalSchema.shape.additionalInfo.innerType().element.parse({
      pharmacyId: data.pharmacyId,
      value: data.value,
    })
  },
  toModel: (
    values: AdditionalChemicalInfoFields,
  ): Prisma.AdditionalChemicalInfoUncheckedCreateWithoutChemicalInput => {
    return {
      pharmacyId: values.pharmacyId,
      value: values.value,
    }
  },
}

export default AdditionalChemicalInfoMapper
