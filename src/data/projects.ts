export interface Project {
  id: string;
  name: string;
  city: string;
  type: "apartment" | "villa" | "commercial";
  status: "upcoming" | "inProgress" | "delivered";
  image: string;
  description: {
    en: string;
    fr: string;
    ar: string;
  };
  features: string[];
  location: string;
}

/**
 * @deprecated Legacy static data retained only for backward compatibility.
 * Public projects now come from Supabase.
 */
export const projects: Project[] = [];

