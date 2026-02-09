import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: { en: "Ahmed Benali", fr: "Ahmed Benali", ar: "أحمد بنعلي" },
    role: { en: "Property Owner, Algiers", fr: "Propriétaire, Alger", ar: "مالك عقار، الجزائر العاصمة" },
    text: {
      en: "Sahtat Promotion exceeded all our expectations. The quality of construction and attention to detail is remarkable.",
      fr: "Sahtat Promotion a dépassé toutes nos attentes. La qualité de la construction et l'attention aux détails sont remarquables.",
      ar: "تجاوزت صحة ترقية جميع توقعاتنا. جودة البناء والاهتمام بالتفاصيل أمر لافت.",
    },
  },
  {
    name: { en: "Fatima Zahra", fr: "Fatima Zahra", ar: "فاطمة الزهراء" },
    role: { en: "Investor, Oran", fr: "Investisseuse, Oran", ar: "مستثمرة، وهران" },
    text: {
      en: "A trustworthy partner in real estate. Their transparency and professionalism made the entire process seamless.",
      fr: "Un partenaire de confiance dans l'immobilier. Leur transparence et professionnalisme ont rendu le processus fluide.",
      ar: "شريك موثوق في العقارات. شفافيتهم ومهنيتهم جعلت العملية بأكملها سلسة.",
    },
  },
  {
    name: { en: "Youcef Khelifi", fr: "Youcef Khelifi", ar: "يوسف خليفي" },
    role: { en: "Family Home Owner", fr: "Propriétaire de Maison Familiale", ar: "مالك منزل عائلي" },
    text: {
      en: "Our family found our dream home thanks to Sahtat Promotion. The after-sales support has been exceptional.",
      fr: "Notre famille a trouvé la maison de nos rêves grâce à Sahtat Promotion. Le service après-vente a été exceptionnel.",
      ar: "وجدت عائلتنا منزل أحلامنا بفضل صحة ترقية. خدمة ما بعد البيع كانت استثنائية.",
    },
  },
];

export function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("testimonials.sectionTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("testimonials.sectionSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <Quote className="h-8 w-8 text-accent/40" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                "{item.text[lang] || item.text.en}"
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-display font-semibold">{item.name[lang] || item.name.en}</p>
                <p className="text-xs text-muted-foreground">{item.role[lang] || item.role.en}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
