-- chemicals
CREATE POLICY
  restrict_guest_insert_policy ON public."chemicals" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."chemicals" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."chemicals" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- compounds
CREATE POLICY
  restrict_guest_insert_policy ON public."compounds" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."compounds" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."compounds" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- directory
CREATE POLICY
  restrict_guest_insert_policy ON public."directory" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."directory" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."directory" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- ingredients
CREATE POLICY
  restrict_guest_insert_policy ON public."ingredients" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."ingredients" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."ingredients" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- mfrs
CREATE POLICY
  restrict_guest_insert_policy ON public."mfrs" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."mfrs" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."mfrs" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- products
CREATE POLICY
  restrict_guest_insert_policy ON public."products" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."products" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."products" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- risk_assessments
CREATE POLICY
  restrict_guest_insert_policy ON public."risk_assessments" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."risk_assessments" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."risk_assessments" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- routine_completions
CREATE POLICY
  restrict_guest_insert_policy ON public."routine_completions" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."routine_completions" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."routine_completions" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- routines
CREATE POLICY
  restrict_guest_insert_policy ON public."routines" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."routines" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."routines" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- safety_data_sheets
CREATE POLICY
  restrict_guest_insert_policy ON public."safety_data_sheets" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."safety_data_sheets" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."safety_data_sheets" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- vendors
CREATE POLICY
  restrict_guest_insert_policy ON public."vendors" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."vendors" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."vendors" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- users

CREATE POLICY
  restrict_guest_update_policy ON public."users" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );
  
-- pharmacies
CREATE POLICY
  restrict_guest_insert_policy ON public."pharmacies" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."pharmacies" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."pharmacies" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- hazard_category_to_sds
CREATE POLICY
  restrict_guest_insert_policy ON public."hazard_category_to_sds" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."hazard_category_to_sds" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."hazard_category_to_sds" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- settings
CREATE POLICY
  restrict_guest_insert_policy ON public."settings" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."settings" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."settings" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );

-- additional_chemical_info
CREATE POLICY
  restrict_guest_insert_policy ON public."additional_chemical_info" AS RESTRICTIVE FOR INSERT
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_update_policy ON public."additional_chemical_info" AS RESTRICTIVE FOR
UPDATE
WITH
  CHECK (
    public.get_current_role () <> 'Guest'::public."Role"
  );

CREATE POLICY
  restrict_guest_delete_policy ON public."additional_chemical_info" AS RESTRICTIVE FOR DELETE USING (
    public.get_current_role () <> 'Guest'::public."Role"
  );
