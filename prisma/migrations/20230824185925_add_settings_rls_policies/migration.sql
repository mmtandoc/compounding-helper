CREATE POLICY tenant_isolation_policy ON public.settings USING ("pharmacyId" = get_current_pharmacy_id());
-- Only admin or superadmin can change settings
CREATE POLICY update_policy ON public.settings FOR UPDATE USING (get_current_role() IN ('Admin', 'SuperAdmin'));