import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_role_en: string | null;
  reviewer_role_fr: string | null;
  reviewer_role_ar: string | null;
  text_en: string;
  text_fr: string | null;
  text_ar: string | null;
  rating: number | null;
}

// Fallback static reviews if DB has none yet
const fallbackReviews: Review[] = [
  {
    id: "1",
    reviewer_name: "Ahmed B.",
    reviewer_role_en: "Property Owner, Médéa",
    reviewer_role_fr: "Propriétaire, Médéa",
    reviewer_role_ar: "مالك عقار، المدية",
    text_en: "Sahtat Promotion exceeded all our expectations. The quality of construction in Résidence El-Quimmah is remarkable.",
    text_fr: "Sahtat Promotion a dépassé toutes nos attentes. La qualité de la Résidence El-Quimmah est remarquable.",
    text_ar: "تجاوزت سحتات بروموسيون جميع توقعاتنا. جودة البناء في مشروع القمة أمر لافت.",
    rating: 5,
  },
  {
    id: "2",
    reviewer_name: "Fatima Z.",
    reviewer_role_en: "Apartment Owner, Béziouch",
    reviewer_role_fr: "Propriétaire, Béziouch",
    reviewer_role_ar: "مالكة شقة، بزيوش",
    text_en: "A trustworthy partner in real estate. Their transparency and professionalism made the entire process seamless.",
    text_fr: "Un partenaire de confiance. Leur transparence et professionnalisme ont rendu le processus très simple.",
    text_ar: "شريك موثوق في العقارات. شفافيتهم ومهنيتهم جعلت العملية بأكملها سلسة.",
    rating: 5,
  },
  {
    id: "3",
    reviewer_name: "Youcef K.",
    reviewer_role_en: "Commercial Unit Owner",
    reviewer_role_fr: "Propriétaire de local commercial",
    reviewer_role_ar: "مالك محل تجاري",
    text_en: "Sahtat Promotion builds more than projects — they build the future. Highly recommended!",
    text_fr: "Sahtat Promotion construit plus que des projets — ils construisent l'avenir. Je recommande!",
    text_ar: "سحتات بروموسيون لا تبني مجرد مشاريع، بل تبني المستقبل. أنصح بشدة!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "fr";
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setReviews(data as Review[]);
      });
  }, []);

  const getText = (r: Review) => {
    if (lang === "ar") return r.text_ar || r.text_en;
    if (lang === "fr") return r.text_fr || r.text_en;
    return r.text_en;
  };

  const getRole = (r: Review) => {
    if (lang === "ar") return r.reviewer_role_ar || r.reviewer_role_en;
    if (lang === "fr") return r.reviewer_role_fr || r.reviewer_role_en;
    return r.reviewer_role_en;
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("testimonials.sectionTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("testimonials.sectionSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <Quote className="h-8 w-8 text-accent/40" />
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating || 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                "{getText(item)}"
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-display font-semibold">{item.reviewer_name}</p>
                <p className="text-xs text-muted-foreground">{getRole(item)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

