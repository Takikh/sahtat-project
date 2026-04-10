import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type NewsRow = {
  id: string;
  slug: string;
  title_en: string;
  title_fr: string | null;
  title_ar: string | null;
  excerpt_en: string | null;
  excerpt_fr: string | null;
  excerpt_ar: string | null;
  content_en: string | null;
  content_fr: string | null;
  content_ar: string | null;
  image_url: string | null;
  published_at: string;
  seo_title_en: string | null;
  seo_title_fr: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_fr: string | null;
  seo_description_ar: string | null;
};

export function useNewsList(limit?: number) {
  const [articles, setArticles] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("news_articles")
        .select("id, slug, title_en, title_fr, title_ar, excerpt_en, excerpt_fr, excerpt_ar, content_en, content_fr, content_ar, image_url, published_at, seo_title_en, seo_title_fr, seo_title_ar, seo_description_en, seo_description_fr, seo_description_ar")
        .order("published_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        setError(queryError.message);
        setArticles([]);
      } else {
        setArticles((data as NewsRow[]) || []);
      }

      setLoading(false);
    };

    fetchNews();
  }, [limit]);

  return { articles, loading, error };
}

export function useNewsArticle(slugOrId: string | undefined) {
  const [article, setArticle] = useState<NewsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slugOrId) {
        setArticle(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const selectColumns = "id, slug, title_en, title_fr, title_ar, excerpt_en, excerpt_fr, excerpt_ar, content_en, content_fr, content_ar, image_url, published_at, seo_title_en, seo_title_fr, seo_title_ar, seo_description_en, seo_description_fr, seo_description_ar";

      const bySlug = await supabase
        .from("news_articles")
        .select(selectColumns)
        .eq("slug", slugOrId)
        .maybeSingle();

      if (bySlug.error) {
        setError(bySlug.error.message);
        setArticle(null);
        setLoading(false);
        return;
      }

      if (bySlug.data) {
        setArticle(bySlug.data as NewsRow);
        setLoading(false);
        return;
      }

      const byId = await supabase
        .from("news_articles")
        .select(selectColumns)
        .eq("id", slugOrId)
        .maybeSingle();

      if (byId.error) {
        setError(byId.error.message);
        setArticle(null);
      } else {
        setArticle((byId.data as NewsRow | null) ?? null);
      }

      setLoading(false);
    };

    fetchArticle();
  }, [slugOrId]);

  return { article, loading, error };
}
