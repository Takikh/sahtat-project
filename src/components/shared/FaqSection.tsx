import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFaqs } from "@/hooks/useFaqs";

type Props = {
  page: "projects" | "contact";
  title: string;
  subtitle?: string;
};

export function FaqSection({ page, title, subtitle }: Props) {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const { faqs, loading, error } = useFaqs(page);

  const pick = (en: string | null, fr: string | null, ar: string | null) => {
    if (lang === "fr") return fr || en || "";
    if (lang === "ar") return ar || en || "";
    return en || "";
  };

  return (
    <section className="py-14 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold">{title}</h2>
          {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
        </div>

        {loading ? (
          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">{t("common.loading")}</div>
        ) : error ? (
          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">{error}</div>
        ) : faqs.length === 0 ? (
          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">{t("admin.tabs.faqs", "FAQs")}: {t("projects.emptyTitle", "No data available")}</div>
        ) : (
          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card px-6">
            <Accordion type="single" collapsible>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">{pick(faq.question_en, faq.question_fr, faq.question_ar)}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{pick(faq.answer_en, faq.answer_fr, faq.answer_ar)}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </section>
  );
}
