export type HazardFields = {
  id?: number
  classId: number
  categoryId: number
  subcategoryId?: number | null
  additionalInfo?: string | null
}

export type SdsFields = {
  id?: number
  chemicalId: number
  productId: number
  hmisHazardLevel: number
  revisionDate: string
  hazards: HazardFields[]
  requireVentilation: boolean
}

export type ChemicalFields = {
  id?: number
  name: string
  casNumber: string | null
  hasNoCasNumber: boolean
  synonyms?: string[]
  nioshTable: -1 | 1 | 2 | 3
  nioshRevisionDate: string | null
}

export type ProductFields = {
  id?: number
  name: string
  chemicalId: number
  vendorId: number
}

export type ExposureRisksFields = {
  skin: boolean
  eye: boolean
  inhalation: boolean
  oral: boolean
  other: boolean
  otherDescription: string | null
}

export type IngredientFields = {
  order: number
  chemicalId: number | null
  productId: number | null
  sdsId: number | null
  physicalForm: "cream" | "ointment" | "powder" | "liquid" | "solid"
  commercialProduct: {
    isCommercialProduct: boolean
    name?: string | null
    din?: number | null
    hasNoDin?: boolean | null
    hasProductMonographConcerns?: boolean | null
    concernsDescription?: string | null
  }
}

export type RiskAssessmentFields = {
  id?: number
  compoundName: string
  ingredients: IngredientFields[]
  complexity: "simple" | "moderate" | "complex"
  isPreparedOccasionally: boolean
  preparationFrequency: "daily" | "weekly" | "monthly"
  isSmallQuantity: boolean
  averagePreparationAmount: {
    quantity: number
    unit: "g" | "ml"
  }
  isConcentrationHealthRisk: boolean
  requireSpecialEducation: boolean
  hasVerificationSteps: boolean
  haveAppropriateFacilities: boolean
  requireVentilation: boolean
  isWorkflowUninterrupted: boolean
  workflowStandardsProcess?: string
  microbialContaminationRisk: boolean
  crossContaminationRisk: boolean
  exposureRisks: {
    sds: ExposureRisksFields
    productMonograph?: ExposureRisksFields
  }
  ppe: {
    gloves: {
      required: boolean
      type: "regular" | "chemotherapy" | "double" | null
    }
    coat: {
      required: boolean
      type: "designated" | "disposable" | null
    }
    mask: {
      required: boolean
      type?: string
    }
    eyeProtection: {
      required: boolean
    }
    other?: string
  }
  requireEyeWashStation: boolean
  requireSafetyShower: boolean
  riskLevel: "A" | "B" | "C"
  rationaleList: {
    automatic: string[]
    additional: string[]
  }
  dateAssessed: string
}
