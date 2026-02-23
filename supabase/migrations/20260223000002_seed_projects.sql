-- Add Instagram to project details and fix profiles foreign key for admin queries

-- Allow admin to query profiles via purchased_properties join
-- The profiles table joins via user_id field; no schema change needed.

-- Seed initial project data for Sahtat Promotion if not exists
INSERT INTO public.projects (name, slug, city, type, status, description_en, description_fr, description_ar, location, features)
SELECT 
  'Résidence El-Quimmah',
  'residence-el-quimmah',
  'Médéa',
  'apartment',
  'inProgress',
  'A prestigious residential project in the highly sought-after Béziouch neighborhood of Médéa. Elegant apartments offering a practical and comfortable living environment, well-served by public transportation. A project where excellence meets quality.',
  'Un projet résidentiel de prestige dans le quartier très recherché de Béziouch à Médéa. Appartements élégants offrant un cadre de vie pratique et agréable, bien desservi par les transports en commun. Un projet où l''excellence rencontre la qualité.',
  'مشروع سكني راقٍ في حي بزيوش المرغوب فيه بمدينة المدية. شقق أنيقة توفر إطار حياة عملي ومريح، مع قرب من وسائل النقل. مشروع تلتقي فيه الجودة بالتميز.',
  'Béziouch, Médéa',
  '["Ascenseur", "Parking", "Sécurité 24h/24", "Espaces verts", "Résidence clôturée", "Finitions soignées"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE slug = 'residence-el-quimmah');

INSERT INTO public.projects (name, slug, city, type, status, description_en, description_fr, description_ar, location, features)
SELECT
  'Résidence Amir',
  'residence-amir',
  'Médéa',
  'apartment',
  'delivered',
  'A completed and fully enclosed residence in Bablakouas, Médéa. This delivered project exemplifies Sahtat Promotion''s commitment to quality construction and modern living.',
  'Une résidence clôturée et entièrement livrée à Bablakouas, Médéa. Ce projet livré illustre l''engagement de Sahtat Promotion envers la qualité de construction et la vie moderne.',
  'إقامة منجزة ومحاطة بالكامل في بابلاكواس، المدية. يجسد هذا المشروع المُسلَّم التزام سحتات بروموسيون بالبناء عالي الجودة والحياة العصرية.',
  'Bablakouas, Médéa',
  '["Résidence clôturée", "Parking privé", "Finitions de qualité", "Environnement calme"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE slug = 'residence-amir');

INSERT INTO public.projects (name, slug, city, type, status, description_en, description_fr, description_ar, location, features)
SELECT
  'Locaux Commerciaux – Médéa Centre',
  'locaux-commerciaux-medea-centre',
  'Médéa',
  'commercial',
  'delivered',
  'Comfortable and refined commercial spaces nestled in a calm and secured environment in Médéa city centre. Attractive for their careful finishes and natural luminosity, within a modern residence designed for a serene daily life.',
  'Des locaux commerciaux confortables et raffinés, nichés dans un environnement calme et sécurisé à Médéa centre. Ils séduisent par leurs finitions soignées et leur luminosité naturelle, au sein d''une résidence moderne pensée pour un quotidien serein.',
  'محلات تجارية مريحة وراقية في بيئة هادئة وآمنة بوسط مدينة المدية. تتميز بتشطيباتها العالية وإضاءتها الطبيعية، ضمن إقامة عصرية تضمن راحة يومية.',
  'Boulevard Boumnir Mouloud, Rue d''Alger, Médéa Centre',
  '["Luminosité naturelle", "Sécurisé", "Environnement calme", "Finitions soignées", "Accès facile", "Centre-ville"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE slug = 'locaux-commerciaux-medea-centre');
