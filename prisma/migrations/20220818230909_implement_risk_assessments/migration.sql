-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "GlovesType" AS ENUM ('regular', 'chemotherapy', 'double');

-- CreateEnum
CREATE TYPE "CoatType" AS ENUM ('designated', 'disposable');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('g', 'ml');

-- CreateEnum
CREATE TYPE "Complexity" AS ENUM ('Simple', 'Moderate', 'Complex');

-- CreateEnum
CREATE TYPE "PreparationFrequency" AS ENUM ('daily', 'weekly', 'monthly');

-- CreateEnum
CREATE TYPE "PhysicalForm" AS ENUM ('cream', 'ointment', 'powder', 'liquid', 'solid');

-- CreateTable
CREATE TABLE "risk_assessments" (
    "id" SERIAL NOT NULL,
    "compoundName" TEXT NOT NULL,
    "complexity" "Complexity" NOT NULL,
    "preparationFrequency" "PreparationFrequency" NOT NULL,
    "isPreparedOccasionally" BOOLEAN NOT NULL,
    "isSmallQuantity" BOOLEAN NOT NULL,
    "averagePreparationAmountQuantity" DOUBLE PRECISION,
    "averagePreparationAmountUnit" "Unit",
    "isConcentrationHealthRisk" BOOLEAN NOT NULL,
    "requireSpecialEducation" BOOLEAN NOT NULL,
    "hasVerificationSteps" BOOLEAN NOT NULL,
    "haveAppropriateFacilities" BOOLEAN NOT NULL,
    "requireVentilation" BOOLEAN NOT NULL,
    "isWorkflowUninterrupted" BOOLEAN NOT NULL,
    "workflowStandardsProcess" TEXT,
    "microbialContaminationRisk" BOOLEAN NOT NULL,
    "crossContaminationRisk" BOOLEAN NOT NULL,
    "sdsSkinExposureRisk" BOOLEAN NOT NULL,
    "sdsEyeExposureRisk" BOOLEAN NOT NULL,
    "sdsInhalationExposureRisk" BOOLEAN NOT NULL,
    "sdsOralExposureRisk" BOOLEAN NOT NULL,
    "sdsOtherExposureRisk" BOOLEAN NOT NULL,
    "sdsOtherExposureRiskDescription" TEXT,
    "pmSkinExposureRisk" BOOLEAN,
    "pmEyeExposureRisk" BOOLEAN,
    "pmInhalationExposureRisk" BOOLEAN,
    "pmOralExposureRisk" BOOLEAN,
    "pmOtherExposureRisk" BOOLEAN,
    "pmOtherExposureRiskDescription" TEXT,
    "ppeGlovesRequired" BOOLEAN NOT NULL,
    "ppeGlovesType" "GlovesType",
    "ppeCoatRequired" BOOLEAN NOT NULL,
    "ppeCoatType" "CoatType",
    "ppeMaskRequired" BOOLEAN NOT NULL,
    "ppeMaskType" TEXT,
    "ppeEyeProtectionRequired" BOOLEAN NOT NULL,
    "ppeOther" TEXT,
    "requireEyeWashStation" BOOLEAN NOT NULL,
    "requireSafetyShower" BOOLEAN NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "automaticRationale" TEXT[],
    "additionalRationale" TEXT[],
    "dateAssessed" DATE NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "riskAssessmentId" INTEGER NOT NULL,
    "safetyDataSheetId" INTEGER NOT NULL,
    "physicalForm" "PhysicalForm" NOT NULL,
    "commercialProductName" TEXT,
    "commercialProductDin" INTEGER,
    "hasProductMonographConcerns" BOOLEAN,
    "concernsDescription" TEXT,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_riskAssessmentId_fkey" FOREIGN KEY ("riskAssessmentId") REFERENCES "risk_assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_safetyDataSheetId_fkey" FOREIGN KEY ("safetyDataSheetId") REFERENCES "safety_data_sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
