-- Dynamic project specs/media + multilingual structured content + page FAQs + article SEO

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS price_min_dzd NUMERIC(14, 2),
  ADD COLUMN IF NOT EXISTS price_max_dzd NUMERIC(14, 2),
  ADD COLUMN IF NOT EXISTS area_min_m2 NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS area_max_m2 NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS total_units INTEGER CHECK (total_units IS NULL OR total_units >= 0),
  ADD COLUMN IF NOT EXISTS units_left INTEGER CHECK (units_left IS NULL OR units_left >= 0),
  ADD COLUMN IF NOT EXISTS delivery_date DATE,
  ADD COLUMN IF NOT EXISTS payment_plan_en TEXT,
  ADD COLUMN IF NOT EXISTS payment_plan_fr TEXT,
  ADD COLUMN IF NOT EXISTS payment_plan_ar TEXT,
  ADD COLUMN IF NOT EXISTS what_en TEXT,
  ADD COLUMN IF NOT EXISTS what_fr TEXT,
  ADD COLUMN IF NOT EXISTS what_ar TEXT,
  ADD COLUMN IF NOT EXISTS for_whom_en TEXT,
  ADD COLUMN IF NOT EXISTS for_whom_fr TEXT,
  ADD COLUMN IF NOT EXISTS for_whom_ar TEXT,
  ADD COLUMN IF NOT EXISTS why_now_en TEXT,
  ADD COLUMN IF NOT EXISTS why_now_fr TEXT,
  ADD COLUMN IF NOT EXISTS why_now_ar TEXT,
  ADD COLUMN IF NOT EXISTS included_en TEXT,
  ADD COLUMN IF NOT EXISTS included_fr TEXT,
  ADD COLUMN IF NOT EXISTS included_ar TEXT,
  ADD COLUMN IF NOT EXISTS guarantee_en TEXT,
  ADD COLUMN IF NOT EXISTS guarantee_fr TEXT,
  ADD COLUMN IF NOT EXISTS guarantee_ar TEXT,
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS short_video_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS floor_plan_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS construction_timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_fr TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_ar TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_fr TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_ar TEXT;

CREATE INDEX IF NOT EXISTS idx_projects_city ON public.projects (city);
CREATE INDEX IF NOT EXISTS idx_projects_delivery_date ON public.projects (delivery_date);

ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_fr TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_ar TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_fr TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_ar TEXT;

CREATE TABLE IF NOT EXISTS public.site_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL CHECK (page IN ('projects', 'contact')),
  question_en TEXT NOT NULL,
  question_fr TEXT,
  question_ar TEXT,
  answer_en TEXT NOT NULL,
  answer_fr TEXT,
  answer_ar TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active FAQs" ON public.site_faqs;
CREATE POLICY "Public can view active FAQs"
ON public.site_faqs FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Staff can view all FAQs" ON public.site_faqs;
CREATE POLICY "Staff can view all FAQs"
ON public.site_faqs FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

DROP POLICY IF EXISTS "Staff can insert FAQs" ON public.site_faqs;
CREATE POLICY "Staff can insert FAQs"
ON public.site_faqs FOR INSERT
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

DROP POLICY IF EXISTS "Staff can update FAQs" ON public.site_faqs;
CREATE POLICY "Staff can update FAQs"
ON public.site_faqs FOR UPDATE
USING (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role]))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

DROP POLICY IF EXISTS "Staff can delete FAQs" ON public.site_faqs;
CREATE POLICY "Staff can delete FAQs"
ON public.site_faqs FOR DELETE
USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

DROP TRIGGER IF EXISTS update_site_faqs_updated_at ON public.site_faqs;
CREATE TRIGGER update_site_faqs_updated_at
BEFORE UPDATE ON public.site_faqs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_faqs (page, question_en, question_fr, question_ar, answer_en, answer_fr, answer_ar, sort_order, is_active)
SELECT
  'projects',
  'What payment plans are available?',
  'Quels plans de paiement sont disponibles ?',
  'ما هي خطط الدفع المتاحة؟',
  'Payment plans vary by project and progress stage. You can reserve your unit, then spread payments across agreed milestones.',
  'Les plans de paiement varient selon le projet et l''avancement. Vous pouvez reserver une unite puis repartir les paiements par etapes.',
  'تختلف خطط الدفع حسب المشروع ومرحلة الإنجاز. يمكنك حجز الوحدة ثم تقسيم الدفعات حسب المراحل المتفق عليها.',
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_faqs
  WHERE page = 'projects' AND question_en = 'What payment plans are available?'
);

INSERT INTO public.site_faqs (page, question_en, question_fr, question_ar, answer_en, answer_fr, answer_ar, sort_order, is_active)
SELECT
  'projects',
  'What documents are needed to book a unit?',
  'Quels documents sont necessaires pour reserver une unite ?',
  'ما هي الوثائق المطلوبة لحجز وحدة؟',
  'Usually: ID, reservation request, and agreed payment schedule documents. The sales team confirms the exact list for your unit.',
  'En general : piece d''identite, demande de reservation et documents du calendrier de paiement. L''equipe commerciale confirme la liste finale.',
  'عادة: بطاقة الهوية، طلب الحجز، ووثائق جدول الدفع. يقوم الفريق التجاري بتأكيد القائمة النهائية حسب الوحدة.',
  2,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_faqs
  WHERE page = 'projects' AND question_en = 'What documents are needed to book a unit?'
);

INSERT INTO public.site_faqs (page, question_en, question_fr, question_ar, answer_en, answer_fr, answer_ar, sort_order, is_active)
SELECT
  'contact',
  'How quickly will you reply to my message?',
  'Sous quel delai repondez-vous aux messages ?',
  'كم يستغرق الرد على الرسائل؟',
  'Our team usually replies within one business day. Priority requests through WhatsApp are handled faster during working hours.',
  'Notre equipe repond generalement sous un jour ouvrable. Les demandes urgentes via WhatsApp sont traitees plus vite pendant les heures de travail.',
  'يرد فريقنا عادة خلال يوم عمل واحد. الطلبات المستعجلة عبر واتساب تتم معالجتها بشكل أسرع خلال أوقات العمل.',
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_faqs
  WHERE page = 'contact' AND question_en = 'How quickly will you reply to my message?'
);

INSERT INTO public.site_faqs (page, question_en, question_fr, question_ar, answer_en, answer_fr, answer_ar, sort_order, is_active)
SELECT
  'contact',
  'What happens after I submit a land offer?',
  'Que se passe-t-il apres l''envoi d''une offre de terrain ?',
  'ماذا يحدث بعد إرسال عرض أرض؟',
  'We review the location, legal status, and project potential, then contact you to schedule a discussion or site visit.',
  'Nous etudions l''emplacement, la situation juridique et le potentiel du projet, puis nous vous contactons pour un echange ou une visite.',
  'نقوم بدراسة الموقع والوضعية القانونية وإمكانية التطوير، ثم نتواصل معك لتحديد موعد نقاش أو زيارة ميدانية.',
  2,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_faqs
  WHERE page = 'contact' AND question_en = 'What happens after I submit a land offer?'
);
