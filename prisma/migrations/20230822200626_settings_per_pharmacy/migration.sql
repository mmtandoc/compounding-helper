ALTER TABLE "settings" ADD COLUMN "pharmacyId" INTEGER;

UPDATE "settings" SET "pharmacyId" = 1;

-- AlterTable
ALTER TABLE "settings" DROP CONSTRAINT "settings_pkey",
DROP COLUMN "id",
ALTER COLUMN "pharmacyId" SET NOT NULL,
ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("pharmacyId");

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;


DROP SEQUENCE IF EXISTS "public.settings_id_seq";