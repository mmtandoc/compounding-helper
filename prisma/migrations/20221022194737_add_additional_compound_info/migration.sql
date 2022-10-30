-- AlterTable
ALTER TABLE "compounds" ADD COLUMN     "beyondUseDate" TEXT,
ADD COLUMN     "hasMasterFormulationRecord" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT;
