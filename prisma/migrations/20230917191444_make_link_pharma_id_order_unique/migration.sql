/*
  Warnings:

  - A unique constraint covering the columns `[pharmacyId,order]` on the table `directory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "directory" ALTER COLUMN "order" DROP DEFAULT;
DROP SEQUENCE "directory_order_seq";

-- CreateIndex
CREATE UNIQUE INDEX "directory_pharmacyId_order_key" ON "directory"("pharmacyId", "order");
