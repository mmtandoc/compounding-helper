-- AlterTable
ALTER TABLE "chemicals" ALTER COLUMN "pharmacyId" SET DEFAULT get_current_pharmacy_id();

-- AlterTable
ALTER TABLE "compounds" ALTER COLUMN "pharmacyId" SET DEFAULT get_current_pharmacy_id();

-- AlterTable
ALTER TABLE "directory" ALTER COLUMN "pharmacyId" SET DEFAULT get_current_pharmacy_id();

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "pharmacyId" SET DEFAULT get_current_pharmacy_id();

-- AlterTable
ALTER TABLE "risk_assessments" ALTER COLUMN "pharmacyId" SET DEFAULT get_current_pharmacy_id();

-- AlterTable
ALTER TABLE "routines" ALTER COLUMN "pharmacyId" SET DEFAULT get_current_pharmacy_id();

-- AlterTable
ALTER TABLE "safety_data_sheets" ALTER COLUMN "pharmacyId" SET DEFAULT get_current_pharmacy_id();

-- AlterTable
ALTER TABLE "settings" ALTER COLUMN "pharmacyId" SET DEFAULT get_current_pharmacy_id();

-- AlterTable
ALTER TABLE "vendors" ALTER COLUMN "pharmacyId" SET DEFAULT get_current_pharmacy_id();
