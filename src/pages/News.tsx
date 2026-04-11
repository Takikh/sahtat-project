import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewsList, type NewsRow } from "@/hooks/useNews";
import { useSeo } from "@/hooks/useSeo";

const News = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const locale = lang === "fr" ? "fr-DZ" : lang === "ar" ? "ar-DZ" : "en-US";
  const isRtl = i18n.dir() === "rtl";
  const { articles, loading, error } = useNewsList();

  useSeo({
    title: `${t("news.title")} | Sahtat Promotion`,
    description: t("news.subtitle"),
    canonicalPath: "/news",
    type: "website",
  });

  const getTitle = (article: NewsRow) => {
    if (lang === "fr") return article.title_fr || article.title_en;
    if (lang === "ar") return article.title_ar || article.title_en;
    return article.title_en;
  };

  const getExcerpt = (article: NewsRow) => {
    if (lang === "fr") return article.excerpt_fr || article.excerpt_en || "";
    if (lang === "ar") return article.excerpt_ar || article.excerpt_en || "";
    return article.excerpt_en || "";
  };

  const getPublishedDate = (article: NewsRow) => {
    const parsed = new Date(article.published_at);
    if (Number.isNaN(parsed.getTime())) return article.published_at;
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsed);
  };

  return (
    <Layout>
      <section className="bg-primary py-20 text-primary-foreground dark:bg-slate-900 dark:text-slate-100">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold sm:text-5xl"
          >
            {t("news.title")}
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl opacity-80">{t("news.subtitle")}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        {loading ? (
          <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                <Skeleton className="aspect-video w-full" />
                <div className="space-y-3 p-6">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="container py-10 text-center text-destructive">{error}</div>
        ) : (
          <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <Link
                  to={`/news/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.image_url || "/placeholder.svg"}
                      alt={getTitle(article)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {getPublishedDate(article)}
                    </div>
                    <h2 className="mt-3 font-display text-lg font-semibold line-clamp-2">
                      {getTitle(article)}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{getExcerpt(article)}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      {t("newsPreview.readMore")}
                      <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default News;
