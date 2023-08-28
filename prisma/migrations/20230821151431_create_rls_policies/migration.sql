-- =========== Create RLS policies ===========
-- Create helper functions
CREATE OR REPLACE function get_current_pharmacy_id()
RETURNS int
LANGUAGE sql
AS $$
  SELECT "pharmacyId" FROM public.users WHERE (id::text = current_setting('public.current_user_id', TRUE));
$$
SECURITY DEFINER;

CREATE OR REPLACE function get_current_role()
RETURNS "Role"
LANGUAGE sql
AS $$
  SELECT "role" FROM public.users WHERE (id::text = current_setting('public.current_user_id', TRUE));
$$
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_not_updating_role(
    _id UUID,
    _role "Role"
)
RETURNS BOOLEAN
LANGUAGE sql
AS $$
WITH original_row AS (
    SELECT role
    FROM public.users
    WHERE public.users.id = _id
)
SELECT(
    (SELECT role FROM original_row) = _role
)
$$ 
SECURITY DEFINER;

-- Create central_select_policy & tenant_isolation_policy policies
CREATE POLICY central_select_policy ON public.chemicals FOR SELECT USING ("pharmacyId" IS NULL);
CREATE POLICY tenant_isolation_policy ON public.chemicals USING ("pharmacyId" = get_current_pharmacy_id());


CREATE POLICY central_select_policy ON public.compounds FOR SELECT USING ("pharmacyId" IS NULL);
CREATE POLICY tenant_isolation_policy ON public.compounds USING ("pharmacyId" = get_current_pharmacy_id());


CREATE POLICY central_select_policy ON public.ingredients FOR SELECT USING (
      EXISTS(SELECT 1 FROM public.compounds AS c
             WHERE c.id = "compoundId"
               AND c."pharmacyId" IS NULL
            )
      );
CREATE POLICY tenant_isolation_policy ON public.ingredients
   USING (
      EXISTS(SELECT 1 FROM public.compounds AS c
             WHERE c.id = "compoundId"
               AND c."pharmacyId" = get_current_pharmacy_id()
            )
      );


CREATE POLICY central_select_policy ON public.mfrs FOR SELECT USING (
      EXISTS(SELECT 1 FROM public.compounds AS c
             WHERE c.id = "compoundId"
               AND c."pharmacyId" IS NULL
            )
      );

CREATE POLICY tenant_isolation_policy ON public.mfrs
   USING (
      EXISTS(SELECT 1 FROM public.compounds AS c
             WHERE c.id = "compoundId"
               AND c."pharmacyId" = get_current_pharmacy_id()
            )
      );


CREATE POLICY central_select_policy ON public.products FOR SELECT USING ("pharmacyId" IS NULL);
CREATE POLICY tenant_isolation_policy ON public.products USING ("pharmacyId" = get_current_pharmacy_id());


CREATE POLICY central_select_policy ON public.risk_assessments FOR SELECT USING ("pharmacyId" IS NULL);
CREATE POLICY tenant_isolation_policy ON public.risk_assessments USING ("pharmacyId" = get_current_pharmacy_id());


-- No central routines. CREATE POLICY central_select_policy ON public.chemicals FOR SELECT USING ("pharmacyId" IS NULL);
CREATE POLICY tenant_isolation_policy ON public.routines USING ("pharmacyId" = get_current_pharmacy_id());

CREATE POLICY tenant_isolation_policy ON public.routine_completions
   USING (
      EXISTS(SELECT 1 FROM public.routines AS r
             WHERE r.id = "routineId"
               AND r."pharmacyId" = get_current_pharmacy_id()
            )
      );


CREATE POLICY central_select_policy ON public.safety_data_sheets FOR SELECT USING ("pharmacyId" IS NULL);
CREATE POLICY tenant_isolation_policy ON public.safety_data_sheets USING ("pharmacyId" = get_current_pharmacy_id());


-- CREATE POLICY tenant_isolation_policy ON public.settings USING ("pharmacyId" = get_current_pharmacy_id());

CREATE POLICY central_select_policy ON public.directory FOR SELECT USING ("pharmacyId" IS NULL);
CREATE POLICY tenant_isolation_policy ON public.directory USING ("pharmacyId" = get_current_pharmacy_id());

CREATE POLICY central_select_policy ON public.vendors FOR SELECT USING ("pharmacyId" IS NULL);
CREATE POLICY tenant_isolation_policy ON public.vendors USING ("pharmacyId" = get_current_pharmacy_id());

CREATE POLICY tenant_isolation_policy ON public.pharmacies USING ("id" = get_current_pharmacy_id());
-- Only SuperAdmin can update pharmacy info
CREATE POLICY update_policy ON public.pharmacies USING (get_current_role() = 'SuperAdmin');

-- to view a user, current user must belong to same pharmacy
CREATE POLICY tenant_isolation_policy ON public.users AS PERMISSIVE USING ("pharmacyId" = get_current_pharmacy_id());
-- to update a user, they must either be the current user or a superadmin for that user's pharmacy
CREATE POLICY update_policy ON public.users AS RESTRICTIVE FOR UPDATE USING (get_current_role() = 'SuperAdmin' OR (id::text = current_setting('public.current_user_id', TRUE)));
-- If not SuperAdmin, can't change user's role
CREATE POLICY update_role_policy ON public.users AS RESTRICTIVE WITH CHECK (is_not_updating_role(id, role) OR get_current_role() = 'SuperAdmin' OR (get_current_role() = 'Admin' AND role != 'SuperAdmin'));


-- Create policies to bypass RLS (optional)
CREATE POLICY bypass_rls_policy ON public.chemicals USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.compounds USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.directory USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.ingredients USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.mfrs USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.products USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.risk_assessments USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.routine_completions USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.routines USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.safety_data_sheets USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.settings USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.vendors USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.pharmacies USING (current_setting('public.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON public.users USING (current_setting('public.bypass_rls', TRUE)::text = 'on');