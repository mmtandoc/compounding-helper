/*
  Warnings:

  - Added the required column `compoundingSupervisor` to the `risk_assessments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable

ALTER TABLE "risk_assessments" ADD COLUMN "compoundingSupervisor" TEXT;

UPDATE "risk_assessments" SET "compoundingSupervisor" = 'PC';

ALTER TABLE "risk_assessments"
  ALTER COLUMN "compoundingSupervisor"
  SET NOT NULL;
