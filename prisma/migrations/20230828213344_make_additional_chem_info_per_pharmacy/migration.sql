/*
  Warnings:

  - You are about to drop the column `additionalInfo` on the `chemicals` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "additional_chemical_info" (
    "id" SERIAL NOT NULL,
    "chemicalId" INTEGER NOT NULL,
    "pharmacyId" INTEGER DEFAULT get_current_pharmacy_id(),
    "value" TEXT NOT NULL,

    CONSTRAINT "additional_chemical_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "additional_chemical_info_chemicalId_pharmacyId_key" ON "additional_chemical_info"("chemicalId", "pharmacyId");

-- AddForeignKey
ALTER TABLE "additional_chemical_info" ADD CONSTRAINT "additional_chemical_info_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "chemicals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "additional_chemical_info" ADD CONSTRAINT "additional_chemical_info_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "additional_chemical_info" ("chemicalId", "pharmacyId", "value") SELECT id, "pharmacyId", "additionalInfo" FROM "chemicals" WHERE "additionalInfo" IS NOT NULL;

-- AlterTable
ALTER TABLE "chemicals" DROP COLUMN "additionalInfo";