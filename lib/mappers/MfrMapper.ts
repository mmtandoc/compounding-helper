import { Prisma } from "@prisma/client"
import _ from "lodash"

import { MfrFields, MfrFieldsWithVersion, mfrSchema } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { MfrAll } from "types/models"

const toFieldValues = (data: MfrAll): MfrFields => {
  return mfrSchema.parse({
    ..._.omit(data, [
      "compound",
      "riskAssessment",
      "updatedAt",
      "beyondUseDateValue",
      "beyondUseDateUnit",
      "expectedYieldAmount",
      "expectedYieldUnit",
      "quantities",
    ]),
    compoundId: data.riskAssessment.compoundId,
    beyondUseDate: {
      value: data.beyondUseDateValue,
      unit: data.beyondUseDateUnit,
    },
    expectedYield: {
      amount: data.expectedYieldAmount,
      unit: data.expectedYieldUnit,
    },
    quantities: data.quantities as Prisma.JsonArray,
    qualityControls: data.qualityControls as Prisma.JsonArray,
    effectiveDate: toIsoDateString(data.effectiveDate),
  } as MfrFields)
}

const toModel = (
  values: MfrFieldsWithVersion,
): Prisma.MfrUncheckedCreateInput => {
  return {
    ..._.omit(values, ["beyondUseDate", "expectedYield", "effectiveDate"]),
    beyondUseDateValue: values.beyondUseDate.value,
    beyondUseDateUnit: values.beyondUseDate.unit,
    expectedYieldAmount: values.expectedYield.amount,
    expectedYieldUnit: values.expectedYield.unit,
    effectiveDate: new Date(values.effectiveDate),
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { toFieldValues, toModel }
