ALTER TABLE public.additional_chemical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.additional_chemical_info FORCE ROW LEVEL SECURITY;

CREATE POLICY central_select_policy ON public.additional_chemical_info FOR SELECT USING ("pharmacyId" IS NULL);
CREATE POLICY tenant_isolation_policy ON public.additional_chemical_info USING ("pharmacyId" = get_current_pharmacy_id());

CREATE POLICY bypass_rls_policy ON public.additional_chemical_info USING (current_setting('public.bypass_rls', TRUE)::text = 'on');

GRANT ALL ON public.additional_chemical_info TO rls_user;