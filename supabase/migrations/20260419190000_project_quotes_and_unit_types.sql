-- Phase 1 premium features foundation: project quote requests + apartment/unit types.

CREATE TABLE IF NOT EXISTS public.project_quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  profession TEXT,
  financing_type TEXT,
  wilaya TEXT,
  desired_apartment_type TEXT,
  parking_needed BOOLEAN,
  budget_min_dzd NUMERIC(14, 2),
  budget_max_dzd NUMERIC(14, 2),
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('phone', 'email', 'whatsapp')),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'quoted', 'closed')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit project quotes" ON public.project_quote_requests;
CREATE POLICY "Anyone can submit project quotes"
ON public.project_quote_requests FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can view project quotes" ON public.project_quote_requests;
CREATE POLICY "Staff can view project quotes"
ON public.project_quote_requests FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

DROP POLICY IF EXISTS "Staff can update project quotes" ON public.project_quote_requests;
CREATE POLICY "Staff can update project quotes"
ON public.project_quote_requests FOR UPDATE
USING (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

DROP POLICY IF EXISTS "Staff can delete project quotes" ON public.project_quote_requests;
CREATE POLICY "Staff can delete project quotes"
ON public.project_quote_requests FOR DELETE
USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

CREATE INDEX IF NOT EXISTS idx_project_quote_requests_project_id ON public.project_quote_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_project_quote_requests_status ON public.project_quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_quote_requests_created_at ON public.project_quote_requests(created_at DESC);

DROP TRIGGER IF EXISTS update_project_quote_requests_updated_at ON public.project_quote_requests;
CREATE TRIGGER update_project_quote_requests_updated_at
BEFORE UPDATE ON public.project_quote_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.project_unit_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type_code TEXT NOT NULL,
  label_en TEXT,
  label_fr TEXT,
  label_ar TEXT,
  area_min_m2 NUMERIC(10, 2),
  area_max_m2 NUMERIC(10, 2),
  starting_price_dzd NUMERIC(14, 2),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'limited', 'sold_out')),
  plan_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_unit_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view project unit types" ON public.project_unit_types;
CREATE POLICY "Public can view project unit types"
ON public.project_unit_types FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Staff can insert project unit types" ON public.project_unit_types;
CREATE POLICY "Staff can insert project unit types"
ON public.project_unit_types FOR INSERT
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

DROP POLICY IF EXISTS "Staff can update project unit types" ON public.project_unit_types;
CREATE POLICY "Staff can update project unit types"
ON public.project_unit_types FOR UPDATE
USING (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

DROP POLICY IF EXISTS "Staff can delete project unit types" ON public.project_unit_types;
CREATE POLICY "Staff can delete project unit types"
ON public.project_unit_types FOR DELETE
USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

CREATE INDEX IF NOT EXISTS idx_project_unit_types_project_id ON public.project_unit_types(project_id);
CREATE INDEX IF NOT EXISTS idx_project_unit_types_status ON public.project_unit_types(status);
CREATE INDEX IF NOT EXISTS idx_project_unit_types_sort_order ON public.project_unit_types(sort_order);

DROP TRIGGER IF EXISTS update_project_unit_types_updated_at ON public.project_unit_types;
CREATE TRIGGER update_project_unit_types_updated_at
BEFORE UPDATE ON public.project_unit_types
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();