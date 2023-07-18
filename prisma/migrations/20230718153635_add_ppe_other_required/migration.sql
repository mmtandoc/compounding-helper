/*
  Warnings:

  - Added the required column `ppeOtherRequired` to the `risk_assessments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "risk_assessments" ADD COLUMN     "ppeOtherRequired" BOOLEAN;

UPDATE "risk_assessments" SET "ppeOtherRequired" = true WHERE "ppeOther" IS NOT NULL;

ALTER TABLE "risk_assessments" ALTER COLUMN     "ppeOtherRequired" SET NOT NULL;
