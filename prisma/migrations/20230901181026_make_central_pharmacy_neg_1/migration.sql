/*
  Warnings:

  - Made the column `pharmacyId` on table `additional_chemical_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pharmacyId` on table `chemicals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pharmacyId` on table `compounds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pharmacyId` on table `directory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pharmacyId` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pharmacyId` on table `risk_assessments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pharmacyId` on table `routines` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pharmacyId` on table `safety_data_sheets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pharmacyId` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pharmacyId` on table `vendors` required. This step will fail if there are existing NULL values in that column.

*/
INSERT INTO "pharmacies" (id, name) VALUES (-1, 'Central Pharmacy') ON CONFLICT DO NOTHING;

UPDATE "additional_chemical_info" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "additional_chemical_info" ALTER COLUMN "pharmacyId" SET NOT NULL;


UPDATE "chemicals" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "chemicals" ALTER COLUMN "pharmacyId" SET NOT NULL;

UPDATE "compounds" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "compounds" ALTER COLUMN "pharmacyId" SET NOT NULL;

UPDATE "directory" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "directory" ALTER COLUMN "pharmacyId" SET NOT NULL;

UPDATE "products" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "pharmacyId" SET NOT NULL;

UPDATE "risk_assessments" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "risk_assessments" ALTER COLUMN "pharmacyId" SET NOT NULL;

UPDATE "routines" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "routines" ALTER COLUMN "pharmacyId" SET NOT NULL;

UPDATE "safety_data_sheets" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "safety_data_sheets" ALTER COLUMN "pharmacyId" SET NOT NULL;

UPDATE "users" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "pharmacyId" SET NOT NULL;

UPDATE "vendors" SET "pharmacyId" = -1 WHERE "pharmacyId" IS NULL;
-- AlterTable
ALTER TABLE "vendors" ALTER COLUMN "pharmacyId" SET NOT NULL;

-- Update create_user function
CREATE OR REPLACE FUNCTION public.create_user()
    RETURNS TRIGGER
    AS $$
DECLARE
    new_pharmacy_id int;
    new_role public."Role";
BEGIN
    IF NEW.raw_user_meta_data ? 'pharmacy_id' THEN
        -- TODO: detect if current_setting('public.current_pharmacy_id'::text))::int is set
        new_pharmacy_id := (NEW.raw_user_meta_data ->> 'pharmacy_id')::int;
        new_role := 'User';

    ELSIF NEW.raw_user_meta_data ? 'pharmacy_name' THEN
        new_pharmacy_id := nextval('pharmacies_id_seq');
        new_role := 'SuperAdmin';

        INSERT INTO public.pharmacies(id, name)
            VALUES (new_pharmacy_id, NEW.raw_user_meta_data ->> 'pharmacy_name');
        INSERT INTO public.settings(id)
            VALUES (new_pharmacy_id);
    ELSE
        new_pharmacy_id := -1;
        new_role := 'SuperAdmin';
    END IF;

    INSERT INTO public.users(id, email, "pharmacyId", role)
        VALUES (NEW.id, NEW.email, new_pharmacy_id, new_role);

    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Alter policies

DROP FUNCTION IF EXISTS public.is_central_pharmacy;

CREATE FUNCTION public.is_central_pharmacy(_id int) RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    AS $$
-- Created to support easy modification in function
SELECT (_id = -1)
$$;

ALTER POLICY central_select_policy ON public.additional_chemical_info USING (is_central_pharmacy("pharmacyId"));

ALTER POLICY central_select_policy ON public.chemicals USING (is_central_pharmacy("pharmacyId"));

ALTER POLICY central_select_policy ON public.compounds USING (is_central_pharmacy("pharmacyId"));

ALTER POLICY central_select_policy ON public.directory USING (is_central_pharmacy("pharmacyId"));

ALTER POLICY central_select_policy ON public.ingredients USING (EXISTS ( SELECT 1
   FROM public.compounds c
  WHERE ((c.id = ingredients."compoundId") AND (is_central_pharmacy(c."pharmacyId")))));

ALTER POLICY central_select_policy ON public.mfrs USING (EXISTS ( SELECT 1
   FROM public.compounds c
  WHERE ((c.id = mfrs."compoundId") AND is_central_pharmacy(c."pharmacyId"))));

ALTER POLICY central_select_policy ON public.products USING (is_central_pharmacy("pharmacyId"));

ALTER POLICY central_select_policy ON public.risk_assessments USING (is_central_pharmacy("pharmacyId"));


ALTER POLICY central_select_policy ON public.safety_data_sheets USING (is_central_pharmacy("pharmacyId"));


ALTER POLICY central_select_policy ON public.vendors USING (is_central_pharmacy("pharmacyId"));