import { Prisma } from "@prisma/client"

const chemicalWithNiosh = Prisma.validator<Prisma.ChemicalArgs>()({
  include: {
    nioshList: true,
  },
})

export type ChemicalWithNiosh = Prisma.ChemicalGetPayload<
  typeof chemicalWithNiosh
>
