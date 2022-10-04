/*
 Warnings:
 
 - The primary key for the `ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `id` on the `ingredients` table. All the data in the column will be lost.
 - Added the required column `order` to the `ingredients` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
/*
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_pkey",
 DROP COLUMN "id",
 ADD COLUMN     "order" INTEGER NOT NULL,
 ADD CONSTRAINT "ingredients_pkey" PRIMARY KEY ("riskAssessmentId", "order");
 */
ALTER TABLE "ingredients"
ADD COLUMN "order" INTEGER;

UPDATE PUBLIC.INGREDIENTS ing
SET "order" = (
    SELECT sub_id
    FROM (
        SELECT id,
          "riskAssessmentId",
          row_number() OVER (
            PARTITION BY "riskAssessmentId"
            ORDER BY id
          ) sub_id
        FROM public.ingredients
      ) AS sub
    WHERE sub.id = ing.id
  );

ALTER TABLE "ingredients"
  ALTER COLUMN "order"
  SET NOT NULL;

ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_pkey",
  DROP COLUMN "id",
  ADD CONSTRAINT "ingredients_pkey" PRIMARY KEY ("riskAssessmentId", "order");