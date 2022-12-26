/*
  Warnings:

  - You are about to drop the column `qualityControl` on the `mfrs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mfrs" DROP COLUMN "qualityControl",
ADD COLUMN     "qualityControls" JSONB[];
