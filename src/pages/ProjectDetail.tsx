import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_progress: "bg-accent/10 text-accent",
  inProgress: "bg-accent/10 text-accent",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
};

interface ProjectRow {
  id: string;
  name: string;
  city: string;
  status: string;
  image_url: string | null;
  description_en: string | null;
  description_fr: string | null;
  description_ar: string | null;
  features: string[] | null;
  location: string | null;
}

const normalizeStatus = (status: string) => (status === "in_progress" ? "inProgress" : status);

const ProjectDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      setProject((data as ProjectRow | null) || null);
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground">Loading project...</div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Project not found</h1>
          <Button asChild className="mt-4">
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8">
        <div className="container">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to="/projects">
              <ArrowLeft className="me-2 h-4 w-4" />
              {t("projects.title")}
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden rounded-xl"
            >
              <img src={project.image_url || "/placeholder.svg"} alt={project.name} className="h-full w-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge className={statusColors[project.status] || statusColors.inProgress}>
                {t(`featured.status.${normalizeStatus(project.status)}`)}
              </Badge>
              <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{project.name}</h1>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {project.location || project.city}
              </p>

              <div className="mt-6">
                <h2 className="font-display text-xl font-semibold">{t("projects.description")}</h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {(lang === "fr" ? project.description_fr : lang === "ar" ? project.description_ar : project.description_en) || project.description_en}
                </p>
              </div>

              <div className="mt-6">
                <h2 className="font-display text-xl font-semibold">{t("projects.features")}</h2>
                <ul className="mt-3 grid grid-cols-2 gap-2">
                  {(project.features || []).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">{t("hero.ctaSecondary")}</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
