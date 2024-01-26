-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_safetyDataSheetId_fkey";

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_safetyDataSheetId_fkey" FOREIGN KEY ("safetyDataSheetId") REFERENCES "safety_data_sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
