-- Seed news articles with real client content

INSERT INTO public.news_articles (slug, title_en, title_fr, title_ar, excerpt_en, excerpt_fr, excerpt_ar, content_en, content_fr, content_ar, image_url)
SELECT
  'el-quimmah-launch-event',
  'EL-QUIMMAH: New Prestigious Project Launched in Médéa',
  'EL-QUIMMAH : Lancement d''un Nouveau Projet Prestigieux à Médéa',
  'القمة: إطلاق مشروع جديد راقٍ في المدية',
  'In the heart of Médéa, a new chapter of exceptional real estate begins. Through the EL-QUIMMAH event, we celebrate excellence, quality and refinement.',
  'Au cœur de Médéa, un nouveau chapitre de l''immobilier d''exception commence. À travers l''événement EL-QUIMMAH, nous célébrons l''excellence, la qualité et le raffinement.',
  'في قلب مدينة المدية، يولد مشروع جديد. من خلال فعالية القمة، نحتفل اليوم بالتميز والجودة والرقي.',
  'In the heart of Médéa, a new project rises. A new chapter of exceptional real estate begins today. Through the "EL-QUIMMAH" event, we celebrate excellence, quality and refinement — moments of sharing, smiles, and a collective energy that inspires and unites us. "EL-QUIMMAH" is located in the highly sought-after and well-served Béziouch neighborhood. The residence offers a practical and accessible living environment. With SAHTAT PROMOTION, we build more than projects... we build the future.',
  'Au cœur de Médéa, un nouveau projet s''élève. Un nouveau chapitre de l''immobilier d''exception se commence. À travers l''événement "EL-QUIMMAH", nous célébrons l''excellence, la qualité et le raffinement... Des instants de partage, des sourires, une énergie collective qui nous inspire et nous rassemble. "EL-QUIMMAH" est située dans un quartier très recherché et bien desservi par les transports en commun, lieu dit "BEZIOUCH". La Résidence offre un cadre de vie pratique et accessible. Avec SAHTAT PROMOTION, nous bâtissons plus que des projets... nous bâtissons l''avenir.',
  'في قلب مدينة المدية، يولد مشروع جديد. فصل جديد من فصول العقار الراقي يبدأ اليوم. من خلال فعالية "القِمَّة" نحتفل اليوم بالتميّز بالجودة، وبالرقي. لحظات من المشاركة، ابتسامات صادقة، وطاقة جماعية تلهمنا وتجمعنا معا. مشروع "القِمَّة" يقع في حي مميز ومطلوب بحي "بزيوش" يتمتع بموقع استراتيجي قريب من وسائل النقل. يوفّر المشروع إطار حياة عمليًة ومريحًة. مع سحتات بروموسيون، نحن لا نبني مجرد مشاريع، بل نبني المستقبل.',
  '/images/progress/593434867_2948645422190405_7054678247068316215_n.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.news_articles WHERE slug = 'el-quimmah-launch-event');

INSERT INTO public.news_articles (slug, title_en, title_fr, title_ar, excerpt_en, excerpt_fr, excerpt_ar, content_en, content_fr, content_ar)
SELECT
  'commercial-spaces-medea-centre',
  'Premium Commercial Spaces Available in Médéa Centre',
  'Locaux Commerciaux de Prestige Disponibles au Centre de Médéa',
  'محلات تجارية راقية متاحة في وسط المدية',
  'Comfortable and refined commercial spaces in a calm, secured environment at Médéa centre. Beautiful finishes and natural luminosity.',
  'Des locaux commerciaux confortables et raffinés dans un environnement calme et sécurisé à Médéa centre. Finitions soignées et luminosité naturelle.',
  'محلات تجارية مريحة وراقية في بيئة هادئة وآمنة بوسط مدينة المدية. تشطيبات عالية وإضاءة طبيعية.',
  'We are pleased to announce the availability of premium commercial spaces in Médéa city centre. Located on Boulevard Boumnir Mouloud, Rue d''Alger, these spaces are perfect for businesses looking for quality premises in a prime location. For more information: 0660 84 02 71',
  'Nous avons le plaisir d''annoncer la disponibilité de locaux commerciaux de prestige au centre-ville de Médéa. Situés Boulevard Boumnir Mouloud, rue d''Alger, ces espaces sont idéaux pour les entreprises recherchant des locaux de qualité dans un emplacement privilégié. Pour plus d''informations : 0660 84 02 71',
  'يسعدنا الإعلان عن توفر محلات تجارية راقية في وسط مدينة المدية. تقع في شارع بومنير مولود، شارع الجزائر، وهي مثالية للأعمال التجارية التي تبحث عن مقرات ذات جودة في موقع متميز. للمزيد من المعلومات: 0660 84 02 71'
WHERE NOT EXISTS (SELECT 1 FROM public.news_articles WHERE slug = 'commercial-spaces-medea-centre');
