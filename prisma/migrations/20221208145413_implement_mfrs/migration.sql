-- CreateEnum
CREATE TYPE "TimeUnit" AS ENUM ('days', 'months');

-- CreateEnum
CREATE TYPE "Storage" AS ENUM ('room', 'fridge', 'freezer');

-- CreateTable
CREATE TABLE "mfrs" (
    "compoundId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "riskAssessmentId" INTEGER NOT NULL,
    "quantities" JSONB NOT NULL,
    "expectedYieldAmount" DOUBLE PRECISION NOT NULL,
    "expectedYieldUnit" "Unit" NOT NULL,
    "training" TEXT[],
    "requiredEquipment" TEXT[],
    "calculations" TEXT,
    "compoundingMethod" TEXT NOT NULL,
    "qualityControl" TEXT NOT NULL,
    "beyondUseDateValue" INTEGER NOT NULL,
    "beyondUseDateUnit" "TimeUnit" NOT NULL,
    "storage" "Storage" NOT NULL,
    "packaging" TEXT NOT NULL,
    "labelling" TEXT[],
    "references" TEXT[],
    "developedBy" TEXT NOT NULL,
    "verifiedBy" TEXT,
    "effectiveDate" DATE NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mfrs_pkey" PRIMARY KEY ("compoundId","version")
);

-- AddForeignKey
ALTER TABLE "mfrs" ADD CONSTRAINT "mfrs_compoundId_fkey" FOREIGN KEY ("compoundId") REFERENCES "compounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfrs" ADD CONSTRAINT "mfrs_riskAssessmentId_fkey" FOREIGN KEY ("riskAssessmentId") REFERENCES "risk_assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
