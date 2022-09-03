import { Prisma } from "@prisma/client"


const sdsWithHazards = Prisma.validator<Prisma.SDSArgs>()({
  include: {
    healthHazards: {
      include: {
        hazardCategory: {
          include: {
            hazardClass: true,
          },
        },
      },
    },
  },
})

export type SdsWithHazards = Prisma.SDSGetPayload<typeof sdsWithHazards>

const sdsWithRelations = Prisma.validator<Prisma.SDSArgs>()({
  include: {
    product: {
      include: {
        vendor: true,
        chemical: true,
      },
    },
    healthHazards: {
      include: {
        hazardCategory: {
          include: {
            hazardClass: true,
          },
        },
      },
    },
  },
})

export type SdsWithRelations = Prisma.SDSGetPayload<typeof sdsWithRelations>

const chemicalAll = Prisma.validator<Prisma.ChemicalArgs>()({
  include: {
    products: {
      include: {
        vendor: true,
        sds: {
          include: {
            healthHazards: {
              include: {
                hazardCategory: {
                  include: {
                    hazardClass: true,
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

export type ChemicalAll = Prisma.ChemicalGetPayload<typeof chemicalAll>

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
