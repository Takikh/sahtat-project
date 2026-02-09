import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Shield, Award, Lightbulb, Users } from "lucide-react";

const values = [
  { key: "trust", icon: Shield },
  { key: "quality", icon: Award },
  { key: "innovation", icon: Lightbulb },
  { key: "community", icon: Users },
];

export function ValuesSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-secondary py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("values.sectionTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("values.sectionSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <motion.div
              key={value.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <value.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{t(`values.${value.key}.title`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`values.${value.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
