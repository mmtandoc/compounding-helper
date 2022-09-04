import { ExposureRisksFields } from "./../../../types/fields"
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { RiskAssessmentFields, IngredientFields } from "types/fields"
import { Prisma } from "@prisma/client"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      let riskAssessments

      try {
        riskAssessments = await prisma.riskAssessment.findMany({
          orderBy: { id: "asc" },
          include: {
            ingredients: {
              include: {
                safetyDataSheet: {
                  include: {
                    product: {
                      include: {
                        chemical: true,
                        vendor: true,
                      },
                    },
                    healthHazards: {
                      include: {
                        hazardCategory: {
                          include: {
                            hazardClass: true,
                            parentCategory: true,
                            subcategories: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        })
      } catch (error) {
        //TODO: HANDLE ERROR
        console.log(error)
        res.status(500).json({
          error: { code: 500, message: "Encountered error with database." },
        })
        return
      }

      res.status(200).json(riskAssessments)
      return
    }
    case "POST": {
      if (query.debug !== undefined) {
        res.status(200).send({ success: true })
        return
      }
      const result = await prisma.riskAssessment.create({
        include: {
          ingredients: true,
        },
        data: mapRiskAssessmentFieldsToCreateData(req.body),
      })
      res.status(200).json({ success: true, content: result })
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

const mapIngredientsFieldToCreateManyData = (
  ingredients: IngredientFields[],
): Prisma.IngredientCreateManyRiskAssessmentInputEnvelope["data"] => {
  return ingredients.map((ingredient) => {
    return {
      safetyDataSheetId: ingredient.sdsId,
      physicalForm: ingredient.physicalForm,
      commercialProductDin: ingredient?.commercialProduct?.din
        ? Number(ingredient.commercialProduct.din)
        : null,
      commercialProductName: ingredient?.commercialProduct?.name ?? null,
      hasProductMonographConcerns:
        ingredient.commercialProduct?.hasProductMonographConcerns ?? null,
      concernsDescription:
        ingredient.commercialProduct?.concernsDescription ?? null,
    }
  })
}

const mapExposureRisksFieldsToData = (
  prefix: string,
  exposureRisks?: ExposureRisksFields,
) => {
  const data = {} as any
  for (const key in exposureRisks) {
    if (Object.prototype.hasOwnProperty.call(exposureRisks, key)) {
      const nameMap = new Map<keyof ExposureRisksFields, string>([
        ["skin", "SkinExposureRisk"],
        ["eye", "EyeExposureRisk"],
        ["inhalation", "InhalationExposureRisk"],
        ["oral", "OralExposureRisk"],
        ["other", "OtherExposureRisk"],
        ["otherDescription", "OtherExposureRiskDescription"],
      ])
      const name = `${prefix}${nameMap.get(key as keyof ExposureRisksFields)}`
      data[name] = exposureRisks[key as keyof ExposureRisksFields]
    }
  }

  return data
}

const mapRiskAssessmentFieldsToCreateData = (
  fields: RiskAssessmentFields,
): Prisma.RiskAssessmentCreateArgs["data"] => {
  let data = {} as Partial<Prisma.RiskAssessmentCreateArgs["data"]>

  for (const key in fields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      switch (key) {
        case "ingredients":
          data[key] = {
            createMany: {
              data: mapIngredientsFieldToCreateManyData(fields[key]),
            },
          }
          break
        case "averagePreparationAmount":
          const averagePreparationAmount = fields[key]
          data = {
            ...data,
            averagePreparationAmountQuantity: averagePreparationAmount.quantity,
            averagePreparationAmountUnit: averagePreparationAmount.unit,
          }
          break
        case "exposureRisks":
          const exposureRisks = fields[key]
          data = {
            ...data,
            ...mapExposureRisksFieldsToData("sds", exposureRisks.sds),
            ...mapExposureRisksFieldsToData(
              "pm",
              exposureRisks.productMonograph,
            ),
          }
          break
        case "rationaleList":
          data = {
            ...data,
            automaticRationale: fields[key].automatic,
            additionalRationale: fields[key].additional,
          }
          break
        case "ppe":
          const ppe = fields[key]
          data = {
            ...data,
            ppeGlovesRequired: ppe?.gloves?.required,
            ppeGlovesType: ppe?.gloves?.type,
            ppeCoatRequired: ppe?.coat?.required,
            ppeCoatType: ppe?.coat?.type,
            ppeMaskRequired: ppe?.mask?.required,
            ppeMaskType: ppe?.mask?.type,
            ppeEyeProtectionRequired: ppe?.eyeProtection?.required,
            ppeOther: ppe?.other,
          }
          break
        case "dateAssessed":
          data = { ...data, dateAssessed: new Date(fields[key]) }
          break
        default:
          data = {
            ...data,
            ...Object.fromEntries([[key, fields[key as keyof typeof fields]]]),
          }
          break
      }
    }
  }

  return data as Prisma.RiskAssessmentCreateArgs["data"]
}
