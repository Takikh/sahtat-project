import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewsArticle } from "@/hooks/useNews";
import { useSeo } from "@/hooks/useSeo";

const NewsDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const locale = lang === "fr" ? "fr-DZ" : lang === "ar" ? "ar-DZ" : "en-US";
  const { article, loading, error } = useNewsArticle(id);

  const title = article
    ? lang === "fr"
      ? article.title_fr || article.title_en
      : lang === "ar"
        ? article.title_ar || article.title_en
        : article.title_en
    : "";

  const content = article
    ? lang === "fr"
      ? article.content_fr || article.content_en || ""
      : lang === "ar"
        ? article.content_ar || article.content_en || ""
        : article.content_en || ""
    : "";

  const seoTitle = article
    ? lang === "fr"
      ? article.seo_title_fr || article.title_fr || article.title_en
      : lang === "ar"
        ? article.seo_title_ar || article.title_ar || article.title_en
        : article.seo_title_en || article.title_en
    : "";

  const seoDescription = article
    ? lang === "fr"
      ? article.seo_description_fr || article.excerpt_fr || article.excerpt_en
      : lang === "ar"
        ? article.seo_description_ar || article.excerpt_ar || article.excerpt_en
        : article.seo_description_en || article.excerpt_en
    : "";

  const localizedDate = article
    ? new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(new Date(article.published_at))
    : "";

  useSeo({
    title: article ? `${seoTitle} | Sahtat Promotion` : "Sahtat Promotion",
    description: seoDescription || undefined,
    canonicalPath: article ? `/news/${article.slug || article.id}` : "/news",
    image: article?.image_url || null,
    type: "article",
  });

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-8">
          <Skeleton className="mb-6 h-9 w-28" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-10 w-3/4" />
          <Skeleton className="mt-8 aspect-video w-full rounded-xl" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-20 text-center text-destructive">{error}</div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Article not found</h1>
          <Button asChild className="mt-4">
            <Link to="/news">Back to News</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-8">
        <div className="container max-w-4xl">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to="/news">
              <ArrowLeft className="me-2 h-4 w-4" />
              {t("news.title")}
            </Link>
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {localizedDate || article.published_at}
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{title}</h1>

            <div className="mt-8 overflow-hidden rounded-xl">
              <img
                src={article.image_url || "/placeholder.svg"}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-8 text-lg leading-relaxed text-muted-foreground">{content}</div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default NewsDetail;
