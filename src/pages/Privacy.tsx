import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { useSeo } from "@/hooks/useSeo";

const Privacy = () => {
  const { t } = useTranslation();

  useSeo({
    title: `${t("footer.privacy")} | Sahtat Promotion`,
    description: t("legal.privacyIntro", "How Sahtat Promotion processes contact and customer information."),
    canonicalPath: "/privacy",
    type: "website",
  });

  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-3xl space-y-6">
          <h1 className="font-display text-4xl font-bold">{t("footer.privacy")}</h1>
          <p className="text-muted-foreground">{t("legal.privacyIntro", "How Sahtat Promotion processes contact and customer information.")}</p>

          <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
            <p>{t("legal.privacyPoint1", "We collect only the data needed to answer your requests and manage project follow-up.")}</p>
            <p>{t("legal.privacyPoint2", "Your information is not sold to third parties. Access is limited to authorized staff.")}</p>
            <p>{t("legal.privacyPoint3", "You can request correction or deletion of your data by contacting our team.")}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
