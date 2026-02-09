import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { newsArticles } from "@/data/news";

const NewsDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const article = newsArticles.find((a) => a.id === id);

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
              {article.date}
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              {article.title[lang] || article.title.en}
            </h1>

            <div className="mt-8 overflow-hidden rounded-xl">
              <img
                src={article.image}
                alt={article.title[lang] || article.title.en}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-8 text-lg leading-relaxed text-muted-foreground">
              {article.content[lang] || article.content.en}
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default NewsDetail;
