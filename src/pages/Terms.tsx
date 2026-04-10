import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { useSeo } from "@/hooks/useSeo";

const Terms = () => {
  const { t } = useTranslation();

  useSeo({
    title: `${t("footer.terms")} | Sahtat Promotion`,
    description: t("legal.termsIntro", "Conditions for using the Sahtat Promotion website and submitting requests."),
    canonicalPath: "/terms",
    type: "website",
  });

  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-3xl space-y-6">
          <h1 className="font-display text-4xl font-bold">{t("footer.terms")}</h1>
          <p className="text-muted-foreground">{t("legal.termsIntro", "Conditions for using the Sahtat Promotion website and submitting requests.")}</p>

          <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
            <p>{t("legal.termsPoint1", "The information provided on this website is for guidance and may evolve with project progress.")}</p>
            <p>{t("legal.termsPoint2", "Availability, prices, and timelines are indicative until confirmed by formal agreement.")}</p>
            <p>{t("legal.termsPoint3", "By submitting forms, you confirm the accuracy of the information provided.")}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
