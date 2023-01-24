-- AlterTable
ALTER TABLE "compounds" ADD COLUMN     "shortcutSuffix" TEXT,
ADD COLUMN     "shortcutVariations" JSONB;
