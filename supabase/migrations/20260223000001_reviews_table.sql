-- Reviews / Testimonials table
-- Public visibility for approved reviews, admin managed

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name TEXT NOT NULL,
  reviewer_role_en TEXT DEFAULT 'Property Owner',
  reviewer_role_fr TEXT DEFAULT 'Propriétaire',
  reviewer_role_ar TEXT DEFAULT 'مالك عقار',
  text_en TEXT NOT NULL,
  text_fr TEXT,
  text_ar TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can view approved reviews (no login required)
CREATE POLICY "Public can view approved reviews"
  ON public.reviews FOR SELECT
  USING (is_approved = true);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews"
  ON public.reviews FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert sample reviews from real client data
INSERT INTO public.reviews (reviewer_name, reviewer_role_en, reviewer_role_fr, reviewer_role_ar, text_en, text_fr, text_ar, rating) VALUES
(
  'Ahmed B.',
  'Property Owner, Médéa',
  'Propriétaire, Médéa',
  'مالك عقار، المدية',
  'Sahtat Promotion exceeded all our expectations. The quality of construction and attention to detail in Résidence El-Quimmah is remarkable. We are proud to live here.',
  'Sahtat Promotion a dépassé toutes nos attentes. La qualité de la construction de la Résidence El-Quimmah est remarquable. Nous sommes fiers d''y vivre.',
  'تجاوزت سحتات بروموسيون جميع توقعاتنا. جودة البناء والاهتمام بالتفاصيل في مشروع القمة أمر لافت. نحن فخورون بالسكن هنا.',
  5
),
(
  'Fatima Z.',
  'Apartment Owner, Béziouch',
  'Propriétaire d''appartement, Béziouch',
  'مالكة شقة، بزيوش',
  'A trustworthy partner in real estate. Their transparency and professionalism made the entire purchase process seamless. Highly recommended!',
  'Un partenaire de confiance dans l''immobilier. Leur transparence et professionnalisme ont rendu l''achat très simple. Je recommande vivement!',
  'شريك موثوق في العقارات. شفافيتهم ومهنيتهم جعلت عملية الشراء بأكملها سلسة. أنصح بشدة!',
  5
),
(
  'Youcef K.',
  'Commercial Unit Owner',
  'Propriétaire de local commercial',
  'مالك محل تجاري',
  'The commercial spaces at Médéa Centre are perfectly located and beautifully finished. Sahtat Promotion builds more than projects — they build the future.',
  'Les locaux commerciaux au centre de Médéa sont parfaitement situés et magnifiquement finis. Sahtat Promotion construit plus que des projets — ils construisent l''avenir.',
  'المحلات التجارية في وسط المدية موقعها مثالي وتشطيبها رائع. سحتات بروموسيون لا تبني مجرد مشاريع، بل تبني المستقبل.',
  5
);
