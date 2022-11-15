/*
  Warnings:

  - The primary key for the `directory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "directory" DROP CONSTRAINT "directory_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "directory_pkey" PRIMARY KEY ("id");
