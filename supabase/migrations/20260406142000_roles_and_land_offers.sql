-- Extend roles model
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'secretary';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Helper: any role check
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- Land offers submitted by visitors/owners
CREATE TABLE IF NOT EXISTS public.land_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  district TEXT,
  area_m2 NUMERIC(10,2),
  asking_price NUMERIC(14,2),
  ownership_type TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'visit_planned', 'negotiation', 'rejected', 'approved')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.land_offers ENABLE ROW LEVEL SECURITY;

-- Public can submit offers
DROP POLICY IF EXISTS "Anyone can submit land offers" ON public.land_offers;
CREATE POLICY "Anyone can submit land offers"
ON public.land_offers FOR INSERT
WITH CHECK (true);

-- Admin/super_admin can read/update/delete land offers
DROP POLICY IF EXISTS "Admins can view land offers" ON public.land_offers;
CREATE POLICY "Admins can view land offers"
ON public.land_offers FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

DROP POLICY IF EXISTS "Admins can update land offers" ON public.land_offers;
CREATE POLICY "Admins can update land offers"
ON public.land_offers FOR UPDATE
USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

DROP POLICY IF EXISTS "Admins can delete land offers" ON public.land_offers;
CREATE POLICY "Admins can delete land offers"
ON public.land_offers FOR DELETE
USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

-- Grant super_admin rights equivalent to admin on existing tables
DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;
CREATE POLICY "Super admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can manage projects" ON public.projects;
CREATE POLICY "Super admins can manage projects"
ON public.projects FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can manage news" ON public.news_articles;
CREATE POLICY "Super admins can manage news"
ON public.news_articles FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can manage contacts" ON public.contact_submissions;
CREATE POLICY "Super admins can manage contacts"
ON public.contact_submissions FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can manage purchases" ON public.purchased_properties;
CREATE POLICY "Super admins can manage purchases"
ON public.purchased_properties FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can manage progress" ON public.construction_progress;
CREATE POLICY "Super admins can manage progress"
ON public.construction_progress FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can view page views" ON public.page_views;
CREATE POLICY "Super admins can view page views"
ON public.page_views FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can view project views" ON public.project_views;
CREATE POLICY "Super admins can view project views"
ON public.project_views FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can manage reviews" ON public.reviews;
CREATE POLICY "Super admins can manage reviews"
ON public.reviews FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

-- Secretary privileges: update content and progress (no role/user management)
DROP POLICY IF EXISTS "Secretary can insert projects" ON public.projects;
CREATE POLICY "Secretary can insert projects"
ON public.projects FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'secretary'::app_role));

DROP POLICY IF EXISTS "Secretary can update projects" ON public.projects;
CREATE POLICY "Secretary can update projects"
ON public.projects FOR UPDATE
USING (public.has_role(auth.uid(), 'secretary'::app_role));

DROP POLICY IF EXISTS "Secretary can insert news" ON public.news_articles;
CREATE POLICY "Secretary can insert news"
ON public.news_articles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'secretary'::app_role));

DROP POLICY IF EXISTS "Secretary can update news" ON public.news_articles;
CREATE POLICY "Secretary can update news"
ON public.news_articles FOR UPDATE
USING (public.has_role(auth.uid(), 'secretary'::app_role));

DROP POLICY IF EXISTS "Secretary can insert progress" ON public.construction_progress;
CREATE POLICY "Secretary can insert progress"
ON public.construction_progress FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'secretary'::app_role));

DROP POLICY IF EXISTS "Secretary can update progress" ON public.construction_progress;
CREATE POLICY "Secretary can update progress"
ON public.construction_progress FOR UPDATE
USING (public.has_role(auth.uid(), 'secretary'::app_role));

DROP POLICY IF EXISTS "Secretary can view purchases" ON public.purchased_properties;
CREATE POLICY "Secretary can view purchases"
ON public.purchased_properties FOR SELECT
USING (public.has_role(auth.uid(), 'secretary'::app_role));

-- updated_at trigger for land_offers
DROP TRIGGER IF EXISTS update_land_offers_updated_at ON public.land_offers;
CREATE TRIGGER update_land_offers_updated_at
BEFORE UPDATE ON public.land_offers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
