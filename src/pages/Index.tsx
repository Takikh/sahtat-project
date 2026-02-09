import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ValuesSection } from "@/components/home/ValuesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsPreview } from "@/components/home/NewsPreview";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProjects />
      <ValuesSection />
      <TestimonialsSection />
      <NewsPreview />
    </Layout>
  );
};

export default Index;
