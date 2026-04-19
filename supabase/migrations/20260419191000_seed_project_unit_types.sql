-- Seed initial apartment unit types for existing projects.
-- Safe to rerun: each insert is guarded by NOT EXISTS.

INSERT INTO public.project_unit_types (
  project_id,
  type_code,
  label_en,
  label_fr,
  label_ar,
  area_min_m2,
  area_max_m2,
  starting_price_dzd,
  status,
  plan_url,
  sort_order
)
SELECT
  p.id,
  'F2',
  'F2 Apartment',
  'Appartement F2',
  'شقة F2',
  68,
  74,
  9300000,
  'available',
  NULL,
  1
FROM public.projects p
WHERE p.slug = 'residence-el-quimmah'
  AND NOT EXISTS (
    SELECT 1
    FROM public.project_unit_types u
    WHERE u.project_id = p.id
      AND u.type_code = 'F2'
  );

INSERT INTO public.project_unit_types (
  project_id,
  type_code,
  label_en,
  label_fr,
  label_ar,
  area_min_m2,
  area_max_m2,
  starting_price_dzd,
  status,
  plan_url,
  sort_order
)
SELECT
  p.id,
  'F3',
  'F3 Apartment',
  'Appartement F3',
  'شقة F3',
  84,
  98,
  11800000,
  'limited',
  NULL,
  2
FROM public.projects p
WHERE p.slug = 'residence-el-quimmah'
  AND NOT EXISTS (
    SELECT 1
    FROM public.project_unit_types u
    WHERE u.project_id = p.id
      AND u.type_code = 'F3'
  );

INSERT INTO public.project_unit_types (
  project_id,
  type_code,
  label_en,
  label_fr,
  label_ar,
  area_min_m2,
  area_max_m2,
  starting_price_dzd,
  status,
  plan_url,
  sort_order
)
SELECT
  p.id,
  'F4',
  'F4 Apartment',
  'Appartement F4',
  'شقة F4',
  108,
  121,
  14600000,
  'available',
  NULL,
  3
FROM public.projects p
WHERE p.slug = 'residence-el-quimmah'
  AND NOT EXISTS (
    SELECT 1
    FROM public.project_unit_types u
    WHERE u.project_id = p.id
      AND u.type_code = 'F4'
  );

INSERT INTO public.project_unit_types (
  project_id,
  type_code,
  label_en,
  label_fr,
  label_ar,
  area_min_m2,
  area_max_m2,
  starting_price_dzd,
  status,
  plan_url,
  sort_order
)
SELECT
  p.id,
  'F3',
  'F3 Apartment',
  'Appartement F3',
  'شقة F3',
  86,
  95,
  11200000,
  'sold_out',
  NULL,
  1
FROM public.projects p
WHERE p.slug = 'residence-amir'
  AND NOT EXISTS (
    SELECT 1
    FROM public.project_unit_types u
    WHERE u.project_id = p.id
      AND u.type_code = 'F3'
  );

INSERT INTO public.project_unit_types (
  project_id,
  type_code,
  label_en,
  label_fr,
  label_ar,
  area_min_m2,
  area_max_m2,
  starting_price_dzd,
  status,
  plan_url,
  sort_order
)
SELECT
  p.id,
  'Shop-1',
  'Retail Unit 1',
  'Local commercial 1',
  'محل تجاري 1',
  42,
  58,
  15900000,
  'available',
  NULL,
  1
FROM public.projects p
WHERE p.slug = 'locaux-commerciaux-medea-centre'
  AND NOT EXISTS (
    SELECT 1
    FROM public.project_unit_types u
    WHERE u.project_id = p.id
      AND u.type_code = 'Shop-1'
  );

INSERT INTO public.project_unit_types (
  project_id,
  type_code,
  label_en,
  label_fr,
  label_ar,
  area_min_m2,
  area_max_m2,
  starting_price_dzd,
  status,
  plan_url,
  sort_order
)
SELECT
  p.id,
  'Shop-2',
  'Retail Unit 2',
  'Local commercial 2',
  'محل تجاري 2',
  60,
  84,
  22100000,
  'limited',
  NULL,
  2
FROM public.projects p
WHERE p.slug = 'locaux-commerciaux-medea-centre'
  AND NOT EXISTS (
    SELECT 1
    FROM public.project_unit_types u
    WHERE u.project_id = p.id
      AND u.type_code = 'Shop-2'
  );