ALTER TABLE public.hazard_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_category_to_sds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_classes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.hazard_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_category_to_sds FORCE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_classes FORCE ROW LEVEL SECURITY;

CREATE POLICY readonly_policy ON public.hazard_categories FOR SELECT USING (true);
CREATE POLICY readonly_policy ON public.hazard_category_to_sds FOR SELECT USING (true);
CREATE POLICY readonly_policy ON public.hazard_classes FOR SELECT USING (true);