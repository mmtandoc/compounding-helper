-- AlterTable
ALTER TABLE "users"
    ALTER COLUMN "pharmacyId" DROP NOT NULL;

-- Update create_user function trigger
CREATE OR REPLACE FUNCTION public.create_user()
    RETURNS TRIGGER
    AS $$
DECLARE
    new_pharmacy_id int;
BEGIN
    IF NEW.raw_user_meta_data ? 'pharmacy_id' THEN
        -- TODO: detect if current_setting('public.current_pharmacy_id'::text))::int is set
        new_pharmacy_id := (NEW.raw_user_meta_data ->> 'pharmacy_id')::int;

    ELSIF NEW.raw_user_meta_data ? 'pharmacy_name' THEN
        new_pharmacy_id := nextval('pharmacies_id_seq');

        INSERT INTO public.pharmacies(id, name)
            VALUES (new_pharmacy_id, NEW.raw_user_meta_data ->> 'pharmacy_name');
        INSERT INTO public.settings(id)
            VALUES (new_pharmacy_id);
    END IF;

    INSERT INTO public.users(id, email, "pharmacyId")
        VALUES (NEW.id, NEW.email, new_pharmacy_id);

    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

