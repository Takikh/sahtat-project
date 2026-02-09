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
    id: "residence-amir",
    name: "Résidence Amir",
    city: "Médéa",
    type: "apartment",
    status: "inProgress",
    image: project1,
    description: {
      en: "Modern residential complex in the heart of Médéa, located in the Bab Lakouas district (15-Décembre). Features contemporary apartments with quality finishes and modern amenities.",
      fr: "Complexe résidentiel moderne au cœur de Médéa, situé dans le quartier Bab Lakouas (15-Décembre). Comprend des appartements contemporains avec des finitions de qualité et des équipements modernes.",
      ar: "مجمع سكني عصري في قلب المدية، يقع في حي باب لقواس (15-ديسمبر). يضم شققاً معاصرة مع تشطيبات عالية الجودة ووسائل راحة حديثة.",
    },
    features: ["2-4 Rooms", "Modern Design", "Quality Finishes", "Central Location", "Parking"],
    location: "Bab Lakouas, 15-Décembre, Médéa",
  },
  {
    id: "residence-el-raid",
    name: "Résidence El Raid",
    city: "Médéa",
    type: "apartment",
    status: "inProgress",
    image: project2,
    description: {
      en: "Premium residential development in Médéa's Bab Lakouas neighborhood (15-Décembre). Offering spacious apartments designed for modern family living with excellent connectivity.",
      fr: "Développement résidentiel haut de gamme dans le quartier Bab Lakouas de Médéa (15-Décembre). Offrant des appartements spacieux conçus pour la vie familiale moderne avec une excellente connectivité.",
      ar: "تطوير سكني متميز في حي باب لقواس بالمدية (15-ديسمبر). يوفر شققاً واسعة مصممة للحياة العائلية العصرية مع اتصال ممتاز.",
    },
    features: ["3-5 Rooms", "Spacious Layout", "Family Friendly", "Modern Amenities", "Security"],
    location: "Bab Lakouas, 15-Décembre, Médéa",
  },
  {
    id: "commercial-center-medea",
    name: "Centre Commercial Médéa",
    city: "Médéa",
    type: "commercial",
    status: "upcoming",
    image: project3,
    description: {
      en: "Upcoming commercial development in Médéa, designed to provide modern retail and office spaces for local businesses and entrepreneurs.",
      fr: "Développement commercial à venir à Médéa, conçu pour fournir des espaces commerciaux et de bureaux modernes pour les entreprises locales et les entrepreneurs.",
      ar: "تطوير تجاري قادم في المدية، مصمم لتوفير مساحات تجارية ومكتبية حديثة للشركات المحلية ورواد الأعمال.",
    },
    features: ["Retail Spaces", "Office Units", "Modern Infrastructure", "Prime Location"],
    location: "Médéa Center",
  },
  {
    id: "villas-medea",
    name: "Villas Modernes Médéa",
    city: "Médéa",
    type: "villa",
    status: "upcoming",
    image: project4,
    description: {
      en: "Exclusive villa project in Médéa, combining traditional Algerian architecture with modern comfort and design for discerning families.",
      fr: "Projet de villas exclusif à Médéa, alliant architecture algérienne traditionnelle et confort et design modernes pour les familles exigeantes.",
      ar: "مشروع فيلات حصري في المدية، يجمع بين العمارة الجزائرية التقليدية والراحة والتصميم العصري للعائلات المميزة.",
    },
    features: ["4-6 Rooms", "Private Garden", "Garage", "Premium Finishes", "Quiet Location"],
    location: "Médéa",
  },
];

