import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Algerian cityscape" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/65 to-slate-800/45 dark:from-slate-950/92 dark:via-slate-900/75 dark:to-slate-800/55" />
      </div>

      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            {t("hero.title")}
            <br />
            <span className="text-accent">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-primary-foreground/95 sm:text-lg lg:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto font-semibold">
              <Link to="/projects">
                {t("hero.cta")}
                <ArrowRight className={`ms-2 h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full border-white/70 bg-white/5 text-white hover:bg-white/15 hover:text-white dark:border-white/35 dark:bg-slate-950/40 dark:hover:bg-slate-950/65 sm:w-auto font-semibold">
              <Link to="/contact">{t("hero.ctaSecondary")}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
