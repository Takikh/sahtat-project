import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

export interface NewsArticle {
  id: string;
  title: { en: string; fr: string; ar: string };
  excerpt: { en: string; fr: string; ar: string };
  content: { en: string; fr: string; ar: string };
  date: string;
  image: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: "new-project-launch-2025",
    title: {
      en: "Sahtat Promotion Launches New Residential Complex in Algiers",
      fr: "Sahtat Promotion lance un nouveau complexe résidentiel à Alger",
      ar: "صحة ترقية تطلق مجمعاً سكنياً جديداً في الجزائر العاصمة",
    },
    excerpt: {
      en: "We are excited to announce the launch of our newest residential project, featuring 120 modern apartments in the heart of Algiers.",
      fr: "Nous sommes ravis d'annoncer le lancement de notre nouveau projet résidentiel, comprenant 120 appartements modernes au cœur d'Alger.",
      ar: "يسعدنا الإعلان عن إطلاق مشروعنا السكني الجديد، الذي يضم 120 شقة عصرية في قلب الجزائر العاصمة.",
    },
    content: {
      en: "Sahtat Promotion is proud to announce the launch of Résidence El Bahia, a state-of-the-art residential complex located in Bab El Oued, Algiers. The project features 120 modern apartments ranging from F3 to F5, with premium amenities including a swimming pool, underground parking, and 24/7 security. Construction is set to begin in Q2 2025 with an estimated delivery date of Q4 2027.",
      fr: "Sahtat Promotion est fier d'annoncer le lancement de la Résidence El Bahia, un complexe résidentiel ultramoderne situé à Bab El Oued, Alger. Le projet comprend 120 appartements modernes allant du F3 au F5, avec des commodités premium incluant une piscine, un parking souterrain et une sécurité 24h/24.",
      ar: "يفخر صحة ترقية بالإعلان عن إطلاق إقامة البهية، مجمع سكني حديث يقع في باب الوادي بالجزائر العاصمة. يضم المشروع 120 شقة عصرية تتراوح بين 3 و5 غرف.",
    },
    date: "2025-01-15",
    image: project1,
  },
  {
    id: "algerian-real-estate-trends",
    title: {
      en: "Algerian Real Estate Market: Trends and Opportunities in 2025",
      fr: "Marché immobilier algérien : tendances et opportunités en 2025",
      ar: "سوق العقارات الجزائري: اتجاهات وفرص 2025",
    },
    excerpt: {
      en: "An in-depth analysis of the current state of Algeria's real estate market and emerging investment opportunities.",
      fr: "Une analyse approfondie de l'état actuel du marché immobilier algérien et des opportunités d'investissement émergentes.",
      ar: "تحليل معمق للوضع الحالي لسوق العقارات الجزائري وفرص الاستثمار الناشئة.",
    },
    content: {
      en: "The Algerian real estate market continues to evolve with growing demand for modern, quality housing. New government initiatives and infrastructure developments are creating exciting opportunities for both investors and homebuyers.",
      fr: "Le marché immobilier algérien continue d'évoluer avec une demande croissante de logements modernes et de qualité.",
      ar: "يستمر سوق العقارات الجزائري في التطور مع تزايد الطلب على المساكن العصرية والجيدة.",
    },
    date: "2025-02-01",
    image: project2,
  },
  {
    id: "sustainability-construction",
    title: {
      en: "Sustainability in Construction: Our Commitment to Green Building",
      fr: "Durabilité dans la construction : notre engagement pour le bâtiment vert",
      ar: "الاستدامة في البناء: التزامنا بالبناء الأخضر",
    },
    excerpt: {
      en: "How Sahtat Promotion is integrating eco-friendly practices and sustainable materials in our latest projects.",
      fr: "Comment Sahtat Promotion intègre des pratiques écologiques et des matériaux durables dans nos derniers projets.",
      ar: "كيف تدمج صحة ترقية الممارسات الصديقة للبيئة والمواد المستدامة في أحدث مشاريعها.",
    },
    content: {
      en: "At Sahtat Promotion, sustainability is not just a trend — it's a core value. We are committed to implementing green building practices across all our projects, from energy-efficient designs to the use of locally sourced, sustainable materials.",
      fr: "Chez Sahtat Promotion, la durabilité n'est pas qu'une tendance — c'est une valeur fondamentale.",
      ar: "في صحة ترقية، الاستدامة ليست مجرد اتجاه — إنها قيمة أساسية.",
    },
    date: "2025-03-10",
    image: project3,
  },
];
