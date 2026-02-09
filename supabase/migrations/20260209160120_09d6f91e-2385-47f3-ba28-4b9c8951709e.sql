
-- Page views tracking
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  referrer text,
  user_agent text,
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous tracking)
CREATE POLICY "Anyone can insert page views"
ON public.page_views FOR INSERT
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view page views"
ON public.page_views FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Project interest tracking (detail page views)
CREATE TABLE public.project_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert project views"
ON public.project_views FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view project views"
ON public.project_views FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes for analytics queries
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX idx_project_views_created_at ON public.project_views(created_at DESC);
CREATE INDEX idx_project_views_project_id ON public.project_views(project_id);
