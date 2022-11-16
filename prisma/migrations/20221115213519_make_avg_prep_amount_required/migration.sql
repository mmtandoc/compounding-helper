/*
  Warnings:

  - Made the column `averagePreparationAmountQuantity` on table `risk_assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `averagePreparationAmountUnit` on table `risk_assessments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "risk_assessments" ALTER COLUMN "averagePreparationAmountQuantity" SET NOT NULL,
ALTER COLUMN "averagePreparationAmountUnit" SET NOT NULL;
