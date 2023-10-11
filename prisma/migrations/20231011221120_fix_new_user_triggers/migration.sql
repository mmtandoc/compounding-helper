/*Create new user profile logic needs to be moved to update trigger, as raw_app_meta_data column is set
with an update call after the initial create, which is needed to get the user's pharmacy ID.

Also, change so that creating a user without app metadata only assigns them a Guest role, rather than SuperAdmin.*/

DROP TRIGGER IF EXISTS create_user_trigger ON auth.users;

DROP FUNCTION IF EXISTS public.create_user();

CREATE OR REPLACE FUNCTION public.update_user()
    RETURNS TRIGGER
    AS $$
DECLARE
    new_pharmacy_id int;
    new_role public."Role";
BEGIN
    -- Check if user profile already exists
    IF EXISTS(SELECT 1 FROM public.users WHERE id = NEW.id) THEN
        -- If it does exist, just perform typical update
        UPDATE
            public.users
        SET
            email = NEW.email,
            "pharmacyId" = COALESCE((NEW.raw_app_meta_data ->> 'pharmacy_id')::int, "pharmacyId"),
            "updatedAt" = NEW.updated_at
        WHERE
            id = NEW.id;       
    -- Otherwise, we need to create a new user profile
    ELSE
        -- If pharmacy_id exists in raw_app_meta_data, then that pharmacy should already exist
        IF NEW.raw_app_meta_data ? 'pharmacy_id' THEN
            new_pharmacy_id := (NEW.raw_app_meta_data ->> 'pharmacy_id')::int;
        -- Otherwise, if pharmacy_name exists in the app metadata, then we should create a new pharmacy
        ELSIF NEW.raw_app_meta_data ? 'pharmacy_name' THEN
            new_pharmacy_id := nextval('pharmacies_id_seq');
            new_role := 'SuperAdmin';

            INSERT INTO public.pharmacies(id, name)
                VALUES (new_pharmacy_id, NEW.raw_app_meta_data ->> 'pharmacy_name');

            -- TODO: Move creating settings into a create new pharmacy trigger
            INSERT INTO public.settings(id)
                VALUES (new_pharmacy_id);
        -- If neither pharmacy_id nor pharmacy_name exists, the user is likely being created in the Supabase auth UI
        -- therefore we will assign that user to the central pharmacy with a guest role.
        ELSE
            new_pharmacy_id := -1;
            new_role := 'Guest';
        END IF;

        INSERT INTO public.users(id, email, "pharmacyId", role)
            VALUES (NEW.id, NEW.email, new_pharmacy_id, new_role);
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;
