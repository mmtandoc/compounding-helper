DROP POLICY IF EXISTS update_policy ON public.pharmacies;
CREATE POLICY update_policy ON public.pharmacies FOR UPDATE USING (get_current_role() = 'SuperAdmin');