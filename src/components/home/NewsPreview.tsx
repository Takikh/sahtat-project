import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewsList, type NewsRow } from "@/hooks/useNews";

export function NewsPreview() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const isRtl = i18n.dir() === "rtl";
  const { articles, loading, error } = useNewsList(3);

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

  return (
    <section className="bg-secondary py-16 sm:py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("newsPreview.sectionTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("newsPreview.sectionSubtitle")}</p>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                <Skeleton className="aspect-video w-full" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-5 w-11/12" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-destructive">{error}</div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
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
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.image_url || "/placeholder.svg"}
                      alt={getTitle(article)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.published_at}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold line-clamp-2">{getTitle(article)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{getExcerpt(article)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/news">
              {t("newsPreview.viewAll")}
              <ArrowRight className={`ms-2 h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
