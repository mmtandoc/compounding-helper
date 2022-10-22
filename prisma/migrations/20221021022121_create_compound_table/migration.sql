/*
  Warnings:

  - The primary key for the `ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `riskAssessmentId` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `compoundName` on the `risk_assessments` table. All the data in the column will be lost.
  - Added the required column `compoundId` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `compoundId` to the `risk_assessments` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE "compounds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "compounds_pkey" PRIMARY KEY ("id")
);

INSERT INTO "compounds" ("id", "name") SELECT "id", "compoundName" FROM "risk_assessments";


-- AlterTable
ALTER TABLE "risk_assessments" DROP COLUMN "compoundName",
ADD COLUMN "compoundId" INTEGER;

ALTER TABLE "ingredients" ADD COLUMN "compoundId" INTEGER;

UPDATE "ingredients" SET "compoundId" = "riskAssessmentId";
UPDATE "risk_assessments" SET "compoundId" = "id";

ALTER TABLE "risk_assessments" ALTER COLUMN "compoundId" SET NOT NULL;

ALTER TABLE "ingredients"
DROP CONSTRAINT "ingredients_pkey",
ALTER COLUMN "compoundId" SET NOT NULL,
ADD CONSTRAINT "ingredients_pkey" PRIMARY KEY ("compoundId", "order");

-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_riskAssessmentId_fkey";

-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "riskAssessmentId";

-- AddForeignKey
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_compoundId_fkey" FOREIGN KEY ("compoundId") REFERENCES "compounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_compoundId_fkey" FOREIGN KEY ("compoundId") REFERENCES "compounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
