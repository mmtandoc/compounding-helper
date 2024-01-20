DROP POLICY IF EXISTS readonly_policy ON public.hazard_category_to_sds;

CREATE POLICY central_select_policy ON public.hazard_category_to_sds FOR SELECT USING (EXISTS ( SELECT 1
   FROM safety_data_sheets s
  WHERE ((s.id = hazard_category_to_sds."sdsId") AND is_central_pharmacy(s."pharmacyId"))));

CREATE POLICY tenant_isolation_policy ON public.hazard_category_to_sds USING (EXISTS ( SELECT 1
   FROM safety_data_sheets s
  WHERE ((s.id = hazard_category_to_sds."sdsId") AND (s."pharmacyId" = get_current_pharmacy_id()))));

CREATE POLICY bypass_rls_policy ON public.hazard_category_to_sds USING (current_setting('public.bypass_rls', TRUE)::text = 'on');