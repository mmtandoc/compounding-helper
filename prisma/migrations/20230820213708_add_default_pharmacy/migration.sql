INSERT INTO public.pharmacies (name) VALUES ('Test Pharmacy');

UPDATE "chemicals" SET "pharmacyId" = 1 WHERE "pharmacyId" IS NULL;

UPDATE "compounds" SET "pharmacyId" = 1 WHERE "pharmacyId" IS NULL;

UPDATE "directory" SET "pharmacyId" = 1 WHERE "pharmacyId" IS NULL;

UPDATE "products" SET "pharmacyId" = 1 WHERE "pharmacyId" IS NULL;

UPDATE "risk_assessments" SET "pharmacyId" = 1 WHERE "pharmacyId" IS NULL;

UPDATE "routines" SET "pharmacyId" = 1 WHERE "pharmacyId" IS NULL;

UPDATE "safety_data_sheets" SET "pharmacyId" = 1 WHERE "pharmacyId" IS NULL;

UPDATE "vendors" SET "pharmacyId" = 1 WHERE "pharmacyId" IS NULL;