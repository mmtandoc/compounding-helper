-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_safetyDataSheetId_fkey";

-- AlterTable
ALTER TABLE "ingredients" ALTER COLUMN "safetyDataSheetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_safetyDataSheetId_fkey" FOREIGN KEY ("safetyDataSheetId") REFERENCES "safety_data_sheets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
