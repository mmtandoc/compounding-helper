/*
  Warnings:

  - Made the column `shortcutVariations` on table `compounds` required. This step will fail if there are existing NULL values in that column.

*/

UPDATE "compounds" SET "shortcutVariations" = '[]' WHERE "shortcutVariations" IS NULL;

-- AlterTable
ALTER TABLE "compounds" ALTER COLUMN "shortcutVariations" SET NOT NULL,
ALTER COLUMN "shortcutVariations" SET DEFAULT '[]';
