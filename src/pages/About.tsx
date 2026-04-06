import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Award, Target, Eye } from "lucide-react";

const team = [
  { name: "Direction Générale", role: { en: "Management", fr: "Direction", ar: "الإدارة العامة" } },
  { name: "Bureau Technique", role: { en: "Technical Team", fr: "Équipe Technique", ar: "الفريق التقني" } },
  { name: "Service Commercial", role: { en: "Sales Team", fr: "Équipe Commerciale", ar: "الفريق التجاري" } },
  { name: "Service Client", role: { en: "Customer Service", fr: "Service Client", ar: "خدمة العملاء" } },
];

const timeline = [
  { year: "2015", event: { en: "Company Founded in Médéa", fr: "Fondation de l'entreprise à Médéa", ar: "تأسيس الشركة في المدية" } },
  { year: "2017", event: { en: "First Residence Delivered – Bablakouas", fr: "Première résidence livrée – Bablakouas", ar: "تسليم أول إقامة – بابلاكواس" } },
  { year: "2019", event: { en: "Résidence Amir – Clôturée", fr: "Résidence Amir – Clôturée", ar: "إقامة الأمير – منجزة" } },
  { year: "2022", event: { en: "Commercial Spaces in Médéa Centre", fr: "Locaux commerciaux au centre de Médéa", ar: "محلات تجارية في وسط المدية" } },
  { year: "2024", event: { en: "Résidence El-Quimmah – Launched in Béziouch", fr: "Résidence El-Quimmah – Lancée à Béziouch", ar: "إقامة القمة – انطلاقة في بزيوش" } },
];

const About = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold sm:text-5xl"
          >
            {t("about.title")}
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl opacity-80">{t("about.subtitle")}</p>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold">{t("about.historyTitle")}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-muted-foreground">{t("about.historyText")}</p>

          <div className="mx-auto mt-12 max-w-3xl">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 pb-8"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                    {item.year.slice(-2)}
                  </div>
                  {i < timeline.length - 1 && <div className="mt-2 h-full w-px bg-border" />}
                </div>
                <div className="pb-4">
                  <span className="text-sm font-semibold text-accent">{item.year}</span>
                  <p className="mt-1 font-display text-lg font-semibold">{item.event[lang] || item.event.en}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-secondary py-20">
        <div className="container grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl bg-card p-8"
          >
            <Target className="h-10 w-10 text-accent" />
            <h3 className="mt-4 font-display text-2xl font-bold">{t("about.missionTitle")}</h3>
            <p className="mt-3 text-muted-foreground">{t("about.missionText")}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-card p-8"
          >
            <Eye className="h-10 w-10 text-accent" />
            <h3 className="mt-4 font-display text-2xl font-bold">{t("about.visionTitle")}</h3>
            <p className="mt-3 text-muted-foreground">{t("about.visionText")}</p>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold">{t("about.teamTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">{t("about.teamSubtitle")}</p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 className="mt-4 font-display font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{member.role[lang] || member.role.en}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-secondary py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold">{t("about.certTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("about.certSubtitle")}</p>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {["ISO 9001", "ISO 14001", "AQPA", "CTC Algérie"].map((cert) => (
              <div key={cert} className="flex h-24 w-40 items-center justify-center rounded-lg border border-border bg-card">
                <div className="text-center">
                  <Award className="mx-auto h-8 w-8 text-accent" />
                  <span className="mt-2 block text-sm font-semibold">{cert}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
