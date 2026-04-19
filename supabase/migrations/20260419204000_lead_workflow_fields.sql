-- Phase 2: lead workflow enhancements for admin productivity.

ALTER TABLE public.project_quote_requests
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS assigned_to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

ALTER TABLE public.land_offers
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS assigned_to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_project_quote_requests_assigned_to_user_id
  ON public.project_quote_requests(assigned_to_user_id);

CREATE INDEX IF NOT EXISTS idx_project_quote_requests_last_contacted_at
  ON public.project_quote_requests(last_contacted_at DESC);

CREATE INDEX IF NOT EXISTS idx_land_offers_assigned_to_user_id
  ON public.land_offers(assigned_to_user_id);

CREATE INDEX IF NOT EXISTS idx_land_offers_last_contacted_at
  ON public.land_offers(last_contacted_at DESC);