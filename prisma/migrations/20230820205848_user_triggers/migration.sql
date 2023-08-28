-- The Shadow database (used for migrations) does not have the `auth.users` table set up, 
-- so we need to stub it here to not get an error when we try to create the auth triggers.

CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
    "id" UUID NOT NULL,

    CONSTRAINT "stub_users_pkey" PRIMARY KEY ("id")
);


-- Function to create user
CREATE OR REPLACE FUNCTION public.create_user()
  RETURNS TRIGGER
  AS $$
DECLARE
  new_pharmacy_id int;
BEGIN
  RAISE NOTICE 'Creating new user and pharmacy. Creating users for existing pharmacy not yet implemented';
  -- TODO: Implement handling making users for existing pharmacy
  /* INSERT INTO public.users (id, email, "pharmacyId")
    VALUES (NEW.id, NEW.email, (NEW.raw_user_meta_data->>'pharmacy_id')::int); */

  new_pharmacy_id := nextval('pharmacies_id_seq');

  INSERT INTO public.users (id, email, "pharmacyId")
    VALUES (NEW.id, NEW.email, new_pharmacy_id);

  INSERT INTO public.pharmacies (id, name) VALUES (new_pharmacy_id, NEW.raw_user_meta_data->>'pharmacy_name');

  RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Function to update user
CREATE OR REPLACE FUNCTION public.update_user()
  RETURNS TRIGGER
  AS $$
BEGIN
  UPDATE
    public.users
  SET
    email = NEW.email,
    "updatedAt" = NEW.updated_at
  WHERE
    id = NEW.id; -- ::text; cast id to text
  RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Function to delete user
CREATE OR REPLACE FUNCTION public.delete_user()
  RETURNS TRIGGER
  AS $$
BEGIN
  DELETE FROM public.users
  WHERE id = OLD.id; -- ::text; - cast id to text
  RETURN OLD;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Triggers
DROP TRIGGER IF EXISTS create_user_trigger ON auth.users;

CREATE TRIGGER create_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user();

DROP TRIGGER IF EXISTS update_user_trigger ON auth.users;

CREATE TRIGGER update_user_trigger
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user();

DROP TRIGGER IF EXISTS delete_user_trigger ON auth.users;

CREATE TRIGGER delete_user_trigger
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_user();

