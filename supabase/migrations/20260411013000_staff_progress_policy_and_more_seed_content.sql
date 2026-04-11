-- Improve staff visibility for progress updates and seed additional Algeria-focused dynamic content.

-- Secretaries need read access to construction progress to manage updates in admin panel.
DROP POLICY IF EXISTS "Secretary can view progress" ON public.construction_progress;
CREATE POLICY "Secretary can view progress"
ON public.construction_progress FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['secretary'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

-- Normalize city naming for cleaner filters/map grouping.
UPDATE public.projects
SET city = 'Alger'
WHERE lower(city) IN ('alger', 'algiers');

-- Add more projects (Algeria-focused) with map coordinates and media.
INSERT INTO public.projects (
  name,
  slug,
  city,
  type,
  status,
  image_url,
  description_en,
  description_fr,
  description_ar,
  location,
  features,
  latitude,
  longitude,
  price_min_dzd,
  price_max_dzd,
  area_min_m2,
  area_max_m2,
  total_units,
  units_left,
  delivery_date,
  seo_title_en,
  seo_title_fr,
  seo_title_ar,
  seo_description_en,
  seo_description_fr,
  seo_description_ar
)
SELECT
  'Residence Chrea Hills',
  'residence-chrea-hills',
  'Blida',
  'apartment',
  'upcoming',
  '/images/progress/591919291_2948645252190422_2008907025086942410_n.jpg',
  'A family-focused residential program near Chrea axis with modern layouts and practical access to city services.',
  'Un programme residentiel familial proche de l''axe de Chrea avec des plans modernes et un acces pratique aux services urbains.',
  'برنامج سكني عائلي قرب محور الشريعة بتصاميم عصرية ووصول عملي إلى خدمات المدينة.',
  'Chrea Road, Blida',
  '["Secured entrance", "Parking", "Children area", "Modern finishing"]'::jsonb,
  36.4791,
  2.8299,
  8900000,
  16800000,
  75,
  128,
  96,
  41,
  DATE '2028-03-30',
  'Residence Chrea Hills Blida - Apartments, Prices, Delivery',
  'Residence Chrea Hills Blida - Appartements, Prix, Livraison',
  'إقامة الشريعة هيلز البليدة - الشقق والأسعار والتسليم',
  'Explore Chrea Hills in Blida: apartment typologies, pricing range and planned delivery timeline.',
  'Decouvrez Chrea Hills a Blida : typologies, fourchette de prix et calendrier de livraison prevu.',
  'اكتشف مشروع الشريعة هيلز في البليدة: أنماط الشقق ونطاق الأسعار وجدول التسليم المتوقع.'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE slug = 'residence-chrea-hills');

INSERT INTO public.projects (
  name,
  slug,
  city,
  type,
  status,
  image_url,
  description_en,
  description_fr,
  description_ar,
  location,
  features,
  latitude,
  longitude,
  price_min_dzd,
  price_max_dzd,
  area_min_m2,
  area_max_m2,
  total_units,
  units_left,
  delivery_date,
  seo_title_en,
  seo_title_fr,
  seo_title_ar,
  seo_description_en,
  seo_description_fr,
  seo_description_ar
)
SELECT
  'Residence El Bahdja',
  'residence-el-bahdja',
  'Alger',
  'apartment',
  'inProgress',
  '/images/progress/593619765_2948645492190398_2575652475131437816_n.jpg',
  'Urban residence with balanced apartment sizes and direct access to transport corridors in Greater Algiers.',
  'Residence urbaine avec des surfaces d''appartements equilibrees et un acces direct aux axes de transport du Grand Alger.',
  'إقامة حضرية بمساحات شقق متوازنة مع وصول مباشر إلى محاور النقل في الجزائر الكبرى.',
  'Dar El Beida, Alger',
  '["Transit access", "Lift", "Controlled access", "Retail proximity"]'::jsonb,
  36.7134,
  3.2127,
  10400000,
  22100000,
  70,
  140,
  120,
  52,
  DATE '2027-12-31',
  'Residence El Bahdja Alger - City Apartments and Availability',
  'Residence El Bahdja Alger - Appartements urbains et disponibilite',
  'إقامة البهجة الجزائر - شقق حضرية والتوفر',
  'Check El Bahdja apartments in Algiers with area/price ranges and current availability.',
  'Consultez les appartements El Bahdja a Alger avec fourchettes de surface/prix et disponibilite actuelle.',
  'اطلع على شقق إقامة البهجة في الجزائر مع نطاقات المساحة والسعر والتوفر الحالي.'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE slug = 'residence-el-bahdja');

INSERT INTO public.projects (
  name,
  slug,
  city,
  type,
  status,
  image_url,
  description_en,
  description_fr,
  description_ar,
  location,
  features,
  latitude,
  longitude,
  price_min_dzd,
  price_max_dzd,
  area_min_m2,
  area_max_m2,
  total_units,
  units_left,
  delivery_date,
  seo_title_en,
  seo_title_fr,
  seo_title_ar,
  seo_description_en,
  seo_description_fr,
  seo_description_ar
)
SELECT
  'Atlas Business Hub Medea',
  'atlas-business-hub-medea',
  'Medea',
  'commercial',
  'upcoming',
  '/images/progress/594963203_2948645535523727_5497314603072907544_n.jpg',
  'A mixed-use commercial block designed for retail, offices and service activities in central Medea.',
  'Un bloc commercial mixte concu pour commerces, bureaux et activites de services au centre de Medea.',
  'مجمع تجاري متعدد الاستخدامات مخصص للمحلات والمكاتب وأنشطة الخدمات في وسط المدية.',
  'City Center, Medea',
  '["Street visibility", "Flexible units", "Modern facade", "Parking access"]'::jsonb,
  36.2633,
  2.7569,
  12900000,
  30200000,
  28,
  110,
  42,
  31,
  DATE '2028-06-30',
  'Atlas Business Hub Medea - Commercial Units and Launch Pricing',
  'Atlas Business Hub Medea - Locaux commerciaux et prix de lancement',
  'أطلس بيزنس هاب المدية - المحلات التجارية وأسعار الإطلاق',
  'Discover Atlas Business Hub in Medea: commercial unit sizes, launch pricing and phased delivery.',
  'Decouvrez Atlas Business Hub a Medea : surfaces commerciales, prix de lancement et livraison par phases.',
  'اكتشف مشروع أطلس بيزنس هاب في المدية: مساحات الوحدات التجارية وأسعار الإطلاق والتسليم المرحلي.'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE slug = 'atlas-business-hub-medea');

-- Add more news articles (Algeria-focused).
INSERT INTO public.news_articles (
  slug,
  title_en,
  title_fr,
  title_ar,
  excerpt_en,
  excerpt_fr,
  excerpt_ar,
  content_en,
  content_fr,
  content_ar,
  image_url,
  published_at,
  seo_title_en,
  seo_title_fr,
  seo_title_ar,
  seo_description_en,
  seo_description_fr,
  seo_description_ar
)
SELECT
  'blida-residence-planning-update',
  'Blida Planning Update: Chrea Hills enters technical validation phase',
  'Mise a jour Blida : Chrea Hills entre en phase de validation technique',
  'تحديث البليدة: مشروع الشريعة هيلز يدخل مرحلة التحقق التقني',
  'Engineering and planning teams finalized the pre-launch validation package for Chrea Hills in Blida.',
  'Les equipes d''ingenierie et de planification ont finalise le dossier de validation pre-lancement pour Chrea Hills a Blida.',
  'أنهت فرق الهندسة والتخطيط ملف التحقق قبل الإطلاق لمشروع الشريعة هيلز في البليدة.',
  'Following site reviews and urban studies, Chrea Hills has entered technical validation. The next phase focuses on permits, utility coordination and launch timeline confirmation.',
  'Suite aux visites de site et etudes urbaines, Chrea Hills est entre en validation technique. La prochaine phase porte sur les autorisations, la coordination des reseaux et la confirmation du calendrier de lancement.',
  'بعد المعاينات الميدانية والدراسات الحضرية، دخل مشروع الشريعة هيلز مرحلة التحقق التقني. المرحلة التالية تركز على التراخيص وتنسيق الشبكات وتأكيد جدول الإطلاق.',
  '/images/progress/591874639_2948645575523723_2147101144163856009_n.jpg',
  DATE '2026-04-05',
  'Blida Chrea Hills Planning Update',
  'Mise a jour de planification Chrea Hills Blida',
  'تحديث تخطيط الشريعة هيلز البليدة',
  'Latest technical and planning update for the Chrea Hills residential project in Blida.',
  'Derniere mise a jour technique et planification du projet residentiel Chrea Hills a Blida.',
  'آخر تحديث تقني وتخطيطي لمشروع الشريعة هيلز السكني في البليدة.'
WHERE NOT EXISTS (SELECT 1 FROM public.news_articles WHERE slug = 'blida-residence-planning-update');

INSERT INTO public.news_articles (
  slug,
  title_en,
  title_fr,
  title_ar,
  excerpt_en,
  excerpt_fr,
  excerpt_ar,
  content_en,
  content_fr,
  content_ar,
  image_url,
  published_at,
  seo_title_en,
  seo_title_fr,
  seo_title_ar,
  seo_description_en,
  seo_description_fr,
  seo_description_ar
)
SELECT
  'alger-bahdja-structural-progress',
  'Alger progress bulletin: Residence El Bahdja structural works reach 45%',
  'Bulletin Alger : Residence El Bahdja atteint 45% de structure',
  'نشرة الجزائر: أشغال الهيكل في إقامة البهجة تصل إلى 45%',
  'Structural package milestones were reached on schedule for El Bahdja in Algiers.',
  'Les jalons du gros oeuvre ont ete atteints selon le calendrier pour El Bahdja a Alger.',
  'تم بلوغ معالم أشغال الهيكل وفق الجدول الزمني في مشروع إقامة البهجة بالجزائر.',
  'El Bahdja structural milestones are now at 45%. Teams are moving into envelope coordination and MEP routing while preserving delivery targets.',
  'Les jalons de structure d''El Bahdja sont maintenant a 45%. Les equipes passent a la coordination de l''enveloppe et des lots techniques tout en maintenant les objectifs de livraison.',
  'بلغت مراحل الهيكل في مشروع البهجة نسبة 45%. تنتقل الفرق الآن إلى تنسيق الغلاف الخارجي ومسارات الشبكات التقنية مع الحفاظ على أهداف التسليم.',
  '/images/progress/593518319_2948645292190418_2697727548548585938_n.jpg',
  DATE '2026-03-22',
  'El Bahdja Structural Progress in Algiers',
  'Avancement structurel El Bahdja a Alger',
  'تقدم أشغال الهيكل في إقامة البهجة بالجزائر',
  'Progress bulletin for El Bahdja residence in Algiers including structural milestones and next phase.',
  'Bulletin d''avancement de la residence El Bahdja a Alger incluant les jalons structurels et la prochaine phase.',
  'نشرة تقدم مشروع إقامة البهجة في الجزائر مع معالم الهيكل والمرحلة القادمة.'
WHERE NOT EXISTS (SELECT 1 FROM public.news_articles WHERE slug = 'alger-bahdja-structural-progress');

-- Add more approved reviews.
INSERT INTO public.reviews (
  reviewer_name,
  reviewer_role_en,
  reviewer_role_fr,
  reviewer_role_ar,
  text_en,
  text_fr,
  text_ar,
  rating,
  is_approved
)
SELECT
  'Samira H.',
  'Apartment Buyer, Blida',
  'Acquereuse, Blida',
  'مقتنية شقة، البليدة',
  'The team was clear, responsive and professional from reservation to handover planning. We always had visibility on progress.',
  'L''equipe a ete claire, reactive et professionnelle de la reservation a la planification de la remise. Nous avions toujours de la visibilite sur l''avancement.',
  'كان الفريق واضحاً وسريع الاستجابة ومهنياً من الحجز إلى تخطيط التسليم. كنا دائماً على اطلاع بالتقدم.',
  5,
  true
WHERE NOT EXISTS (
  SELECT 1
  FROM public.reviews
  WHERE reviewer_name = 'Samira H.'
);

INSERT INTO public.reviews (
  reviewer_name,
  reviewer_role_en,
  reviewer_role_fr,
  reviewer_role_ar,
  text_en,
  text_fr,
  text_ar,
  rating,
  is_approved
)
SELECT
  'Karim T.',
  'Commercial Investor, Medea',
  'Investisseur commercial, Medea',
  'مستثمر تجاري، المدية',
  'For commercial units, what mattered most was location and long-term value. Sahtat handled both with strong execution.',
  'Pour les locaux commerciaux, le plus important etait l''emplacement et la valeur long terme. Sahtat a bien gere les deux avec une execution solide.',
  'في الوحدات التجارية، كان الأهم الموقع والقيمة على المدى الطويل. سحتات تعاملت مع الأمرين بتنفيذ قوي.',
  5,
  true
WHERE NOT EXISTS (
  SELECT 1
  FROM public.reviews
  WHERE reviewer_name = 'Karim T.'
);
