-- Seed dynamic specs/media/SEO fields for existing projects and news

UPDATE public.projects
SET
  price_min_dzd = COALESCE(price_min_dzd, 9800000),
  price_max_dzd = COALESCE(price_max_dzd, 19500000),
  area_min_m2 = COALESCE(area_min_m2, 78),
  area_max_m2 = COALESCE(area_max_m2, 132),
  total_units = COALESCE(total_units, 84),
  units_left = COALESCE(units_left, 23),
  delivery_date = COALESCE(delivery_date, DATE '2027-06-30'),
  latitude = COALESCE(latitude, 36.2710),
  longitude = COALESCE(longitude, 2.7684),
  payment_plan_en = COALESCE(payment_plan_en, 'Reservation + milestone-based payments during construction.'),
  payment_plan_fr = COALESCE(payment_plan_fr, 'Reservation + paiements echelonnes selon les etapes du chantier.'),
  payment_plan_ar = COALESCE(payment_plan_ar, 'حجز أولي ثم دفعات مرحلية حسب تقدم الأشغال.'),
  what_en = COALESCE(what_en, 'Modern residential program with family-oriented apartment typologies.'),
  what_fr = COALESCE(what_fr, 'Programme residentiel moderne avec des typologies adaptees aux familles.'),
  what_ar = COALESCE(what_ar, 'برنامج سكني عصري بأنماط شقق مناسبة للعائلات.'),
  for_whom_en = COALESCE(for_whom_en, 'Families and buyers looking for practical living close to city services.'),
  for_whom_fr = COALESCE(for_whom_fr, 'Pour les familles et acquereurs cherchant un cadre pratique proche des services.'),
  for_whom_ar = COALESCE(for_whom_ar, 'موجه للعائلات والمشترين الباحثين عن سكن عملي قريب من الخدمات.'),
  why_now_en = COALESCE(why_now_en, 'Launch phase pricing and best unit choices are currently available.'),
  why_now_fr = COALESCE(why_now_fr, 'Tarifs de lancement et meilleur choix d''unites actuellement disponibles.'),
  why_now_ar = COALESCE(why_now_ar, 'أسعار الإطلاق وأفضل خيارات الوحدات متاحة حالياً.'),
  included_en = COALESCE(included_en, 'Elevator, parking, secure access, landscaped areas, quality finishing.'),
  included_fr = COALESCE(included_fr, 'Ascenseur, parking, acces securise, espaces verts, finitions soignées.'),
  included_ar = COALESCE(included_ar, 'مصعد، موقف سيارات، دخول آمن، مساحات خضراء، تشطيبات جيدة.'),
  guarantee_en = COALESCE(guarantee_en, 'Published milestones with periodic progress updates until handover.'),
  guarantee_fr = COALESCE(guarantee_fr, 'Jalons publies avec mises a jour periodiques jusqu''a la remise des cles.'),
  guarantee_ar = COALESCE(guarantee_ar, 'مراحل إنجاز معلنة مع تحديثات دورية حتى التسليم.'),
  gallery_urls = CASE
    WHEN jsonb_array_length(gallery_urls) = 0 THEN '["/images/progress/591836054_2948645458857068_2912251261253597060_n.jpg","/images/progress/591939530_2948645335523747_1749020065561663697_n.jpg","/images/progress/593434867_2948645422190405_7054678247068316215_n.jpg"]'::jsonb
    ELSE gallery_urls
  END,
  construction_timeline = CASE
    WHEN jsonb_array_length(construction_timeline) = 0 THEN '[
      {"date":"2026-02-10","status":"planning","progress":10,"title_en":"Site preparation completed","title_fr":"Preparation du site terminee","title_ar":"استكمال تهيئة الموقع"},
      {"date":"2026-09-20","status":"in_progress","progress":45,"title_en":"Main structure in progress","title_fr":"Structure principale en cours","title_ar":"إنجاز الهيكل الرئيسي قيد التقدم"},
      {"date":"2027-06-30","status":"handover","progress":100,"title_en":"Planned handover","title_fr":"Remise prevue","title_ar":"تسليم مخطط"}
    ]'::jsonb
    ELSE construction_timeline
  END,
  seo_title_en = COALESCE(seo_title_en, 'Residence El-Quimmah in Medea - Prices, Areas, Delivery'),
  seo_title_fr = COALESCE(seo_title_fr, 'Residence El-Quimmah a Medea - Prix, Surfaces, Livraison'),
  seo_title_ar = COALESCE(seo_title_ar, 'إقامة القمة في المدية - الأسعار، المساحات، التسليم'),
  seo_description_en = COALESCE(seo_description_en, 'Explore El-Quimmah project details: location, area range, pricing, availability and expected delivery.'),
  seo_description_fr = COALESCE(seo_description_fr, 'Consultez les details du projet El-Quimmah : localisation, surfaces, prix, disponibilite et livraison.'),
  seo_description_ar = COALESCE(seo_description_ar, 'اكتشف تفاصيل مشروع القمة: الموقع، المساحات، الأسعار، التوفر، وموعد التسليم.')
WHERE slug = 'residence-el-quimmah';

UPDATE public.projects
SET
  price_min_dzd = COALESCE(price_min_dzd, 7600000),
  price_max_dzd = COALESCE(price_max_dzd, 15200000),
  area_min_m2 = COALESCE(area_min_m2, 72),
  area_max_m2 = COALESCE(area_max_m2, 118),
  total_units = COALESCE(total_units, 60),
  units_left = COALESCE(units_left, 0),
  delivery_date = COALESCE(delivery_date, DATE '2024-12-31'),
  latitude = COALESCE(latitude, 36.2642),
  longitude = COALESCE(longitude, 2.7539),
  seo_title_en = COALESCE(seo_title_en, 'Residence Amir - Delivered Residence in Medea'),
  seo_title_fr = COALESCE(seo_title_fr, 'Residence Amir - Residence livree a Medea'),
  seo_title_ar = COALESCE(seo_title_ar, 'إقامة الأمير - مشروع مسلّم في المدية'),
  seo_description_en = COALESCE(seo_description_en, 'Delivered residential project with completed finishes and ready units in Medea.'),
  seo_description_fr = COALESCE(seo_description_fr, 'Projet residentiel livre avec finitions terminees et unites disponibles a Medea.'),
  seo_description_ar = COALESCE(seo_description_ar, 'مشروع سكني مسلّم مع تشطيبات مكتملة ووحدات جاهزة في المدية.')
WHERE slug = 'residence-amir';

UPDATE public.projects
SET
  price_min_dzd = COALESCE(price_min_dzd, 12400000),
  price_max_dzd = COALESCE(price_max_dzd, 28600000),
  area_min_m2 = COALESCE(area_min_m2, 26),
  area_max_m2 = COALESCE(area_max_m2, 94),
  total_units = COALESCE(total_units, 35),
  units_left = COALESCE(units_left, 7),
  delivery_date = COALESCE(delivery_date, DATE '2025-11-30'),
  latitude = COALESCE(latitude, 36.2660),
  longitude = COALESCE(longitude, 2.7558),
  seo_title_en = COALESCE(seo_title_en, 'Medea Centre Commercial Spaces - Availability and Pricing'),
  seo_title_fr = COALESCE(seo_title_fr, 'Locaux Commerciaux Centre Medea - Disponibilite et Tarifs'),
  seo_title_ar = COALESCE(seo_title_ar, 'محلات تجارية وسط المدية - التوفر والأسعار'),
  seo_description_en = COALESCE(seo_description_en, 'Premium commercial units in Medea centre with area and price ranges.'),
  seo_description_fr = COALESCE(seo_description_fr, 'Locaux commerciaux premium au centre de Medea avec surfaces et gammes de prix.'),
  seo_description_ar = COALESCE(seo_description_ar, 'محلات تجارية مميزة في وسط المدية مع نطاقات المساحة والسعر.')
WHERE slug = 'locaux-commerciaux-medea-centre';

UPDATE public.news_articles
SET
  seo_title_en = COALESCE(seo_title_en, title_en),
  seo_title_fr = COALESCE(seo_title_fr, title_fr),
  seo_title_ar = COALESCE(seo_title_ar, title_ar),
  seo_description_en = COALESCE(seo_description_en, excerpt_en),
  seo_description_fr = COALESCE(seo_description_fr, excerpt_fr),
  seo_description_ar = COALESCE(seo_description_ar, excerpt_ar)
WHERE seo_title_en IS NULL OR seo_description_en IS NULL;
