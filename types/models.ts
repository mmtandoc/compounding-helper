import { Prisma } from "@prisma/client"

//TODO: Refactor

export const productAll = Prisma.validator<Prisma.ProductArgs>()({
  include: {
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
    chemical: true,
    vendor: true,
  },
})

export type ProductAll = Prisma.ProductGetPayload<typeof productAll>

const productWithVendor = Prisma.validator<Prisma.ProductArgs>()({
  include: {
    vendor: true,
  },
})

export type ProductWithVendor = Prisma.ProductGetPayload<
  typeof productWithVendor
>

const hazardClassesWithCategories = Prisma.validator<Prisma.HazardClassArgs>()({
  include: {
    hazardCategories: {
      where: { parentLevel: { equals: null } },
      include: { subcategories: true },
    },
  },
})

export type HazardClassesWithCategories = Prisma.HazardClassGetPayload<
  typeof hazardClassesWithCategories
>

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

export const sdsWithRelations = Prisma.validator<Prisma.SDSArgs>()({
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
            parentCategory: true,
            subcategories: true,
          },
        },
      },
    },
  },
})

export type SdsWithRelations = Prisma.SDSGetPayload<typeof sdsWithRelations>

export const chemicalAll = Prisma.validator<Prisma.ChemicalArgs>()({
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

const ingredientAll = Prisma.validator<Prisma.IngredientArgs>()({
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
})

export type IngredientAll = Prisma.IngredientGetPayload<typeof ingredientAll>

export const compoundWithIngredients = Prisma.validator<Prisma.CompoundArgs>()({
  include: {
    ingredients: ingredientAll,
  },
})

export type CompoundWithIngredients = Prisma.CompoundGetPayload<
  typeof compoundWithIngredients
>

export const compoundWithMfrCount =
  Prisma.validator<Prisma.CompoundFindManyArgs>()({
    orderBy: { id: "asc" },
    include: {
      ...compoundWithIngredients.include,
      _count: { select: { mfrs: true } },
    },
  })

export type CompoundWithMfrCount = Prisma.CompoundGetPayload<
  typeof compoundWithMfrCount
>

export const riskAssessmentAll = Prisma.validator<Prisma.RiskAssessmentArgs>()({
  include: {
    compound: compoundWithIngredients,
  },
})

export type RiskAssessmentAll = Prisma.RiskAssessmentGetPayload<
  typeof riskAssessmentAll
>

export const mfrAll = Prisma.validator<Prisma.MfrArgs>()({
  include: {
    compound: compoundWithIngredients,
    riskAssessment: true,
  },
})

export type MfrAll = Prisma.MfrGetPayload<typeof mfrAll>
