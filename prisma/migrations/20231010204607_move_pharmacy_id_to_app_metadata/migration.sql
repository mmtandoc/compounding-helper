-- Use raw_app_meta_data instead of user_meta_data for pharmacy_id,
-- since user metadata can be modified by user, while app metadata can only be modified by admin
CREATE OR REPLACE FUNCTION public.create_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    new_pharmacy_id int;
    new_role public."Role";
BEGIN
    IF NEW.raw_app_meta_data ? 'pharmacy_id' THEN
        -- TODO: detect if current_setting('public.current_pharmacy_id'::text))::int is set
        new_pharmacy_id := (NEW.raw_app_meta_data ->> 'pharmacy_id')::int;
        new_role := 'User';

    ELSIF NEW.raw_app_meta_data ? 'pharmacy_name' THEN
        new_pharmacy_id := nextval('pharmacies_id_seq');
        new_role := 'SuperAdmin';

        INSERT INTO public.pharmacies(id, name)
            VALUES (new_pharmacy_id, NEW.raw_app_meta_data ->> 'pharmacy_name');
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
$$;