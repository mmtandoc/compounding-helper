import { Prisma } from "@prisma/client"

const riskAssessmentAll = Prisma.validator<Prisma.RiskAssessmentArgs>()({
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

export type RiskAssessmentAll = Prisma.RiskAssessmentGetPayload<
  typeof riskAssessmentAll
>
