/*
  Warnings:

  - Added the required column `pharmaceuticalForm` to the `mfrs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routeOfAdministration` to the `mfrs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mfrs" ADD COLUMN     "pharmaceuticalForm" TEXT NOT NULL,
ADD COLUMN     "routeOfAdministration" TEXT NOT NULL;
