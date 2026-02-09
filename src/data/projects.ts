import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

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

export const projects: Project[] = [
  {
    id: "residence-el-bahia",
    name: "Résidence El Bahia",
    city: "Algiers",
    type: "apartment",
    status: "inProgress",
    image: project1,
    description: {
      en: "A premium residential complex in the heart of Algiers, featuring modern apartments with panoramic sea views.",
      fr: "Un complexe résidentiel haut de gamme au cœur d'Alger, avec des appartements modernes offrant des vues panoramiques sur la mer.",
      ar: "مجمع سكني فاخر في قلب الجزائر العاصمة، يضم شققاً عصرية مع إطلالات بانورامية على البحر.",
    },
    features: ["3-5 Rooms", "Parking", "Pool", "Security 24/7", "Sea View"],
    location: "Bab El Oued, Algiers",
  },
  {
    id: "les-jardins-de-constantine",
    name: "Les Jardins de Constantine",
    city: "Constantine",
    type: "villa",
    status: "upcoming",
    image: project2,
    description: {
      en: "Luxury villas surrounded by lush gardens in Constantine, combining traditional charm with modern comfort.",
      fr: "Villas de luxe entourées de jardins luxuriants à Constantine, alliant charme traditionnel et confort moderne.",
      ar: "فيلات فاخرة محاطة بحدائق غنّاء في قسنطينة، تجمع بين السحر التقليدي والراحة العصرية.",
    },
    features: ["4-6 Rooms", "Garden", "Garage", "Smart Home", "Private Pool"],
    location: "El Khroub, Constantine",
  },
  {
    id: "panorama-oran",
    name: "Panorama Oran",
    city: "Oran",
    type: "apartment",
    status: "delivered",
    image: project3,
    description: {
      en: "A landmark residential project in Oran with stunning Mediterranean views and world-class amenities.",
      fr: "Un projet résidentiel emblématique à Oran avec des vues méditerranéennes époustouflantes et des commodités de classe mondiale.",
      ar: "مشروع سكني بارز في وهران مع إطلالات متوسطية خلابة ومرافق عالمية المستوى.",
    },
    features: ["2-4 Rooms", "Gym", "Playground", "Underground Parking"],
    location: "Bir El Djir, Oran",
  },
  {
    id: "centre-affaires-alger",
    name: "Centre d'Affaires Alger",
    city: "Algiers",
    type: "commercial",
    status: "inProgress",
    image: project4,
    description: {
      en: "A state-of-the-art commercial center in Algiers, designed for modern businesses and startups.",
      fr: "Un centre d'affaires à la pointe de la technologie à Alger, conçu pour les entreprises modernes et les startups.",
      ar: "مركز أعمال متطور في الجزائر العاصمة، مصمم للشركات الحديثة والناشئة.",
    },
    features: ["Office Spaces", "Conference Rooms", "High-Speed Internet", "Restaurant"],
    location: "Hydra, Algiers",
  },
];
