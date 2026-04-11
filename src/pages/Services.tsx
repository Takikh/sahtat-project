import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Building2, ClipboardList, LineChart, Headphones, Paintbrush, Scale } from "lucide-react";

const services = [
  { key: "construction", icon: Building2 },
  { key: "management", icon: ClipboardList },
  { key: "consulting", icon: LineChart },
  { key: "afterSales", icon: Headphones },
  { key: "interior", icon: Paintbrush },
  { key: "legal", icon: Scale },
];

const Services = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section className="bg-primary py-20 text-primary-foreground dark:bg-slate-900 dark:text-slate-100">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold sm:text-5xl"
          >
            {t("services.title")}
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl opacity-80">{t("services.subtitle")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <service.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{t(`services.${service.key}.title`)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(`services.${service.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
