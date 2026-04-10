import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteFaqRow {
  id: string;
  page: "projects" | "contact";
  question_en: string;
  question_fr: string | null;
  question_ar: string | null;
  answer_en: string;
  answer_fr: string | null;
  answer_ar: string | null;
  sort_order: number;
  is_active: boolean;
}

export function useFaqs(page: "projects" | "contact") {
  const [faqs, setFaqs] = useState<SiteFaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("site_faqs")
        .select("id, page, question_en, question_fr, question_ar, answer_en, answer_fr, answer_ar, sort_order, is_active")
        .eq("page", page)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (queryError) {
        setFaqs([]);
        setError(queryError.message);
      } else {
        setFaqs((data as SiteFaqRow[]) || []);
      }

      setLoading(false);
    };

    fetchFaqs();
  }, [page]);

  return { faqs, loading, error };
}
