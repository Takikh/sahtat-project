export interface NewsArticle {
  id: string;
  title: { en: string; fr: string; ar: string };
  excerpt: { en: string; fr: string; ar: string };
  content: { en: string; fr: string; ar: string };
  date: string;
  image: string;
}

/**
 * @deprecated Legacy static data retained only for backward compatibility.
 * Public news now comes from Supabase via `useNewsList()` / `useNewsArticle()`.
 */
export const newsArticles: NewsArticle[] = [];
