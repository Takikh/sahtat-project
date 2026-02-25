import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { resolveProjectImage } from "@/lib/projectImage";
import { projects as fallbackProjects } from "@/data/projects";

interface ProjectRow {
  id: string;
  slug?: string;
  name: string;
  city: string;
  type?: string;
  status: string;
  image_url: string | null;
}

const fallbackFeatured: ProjectRow[] = fallbackProjects.slice(0, 4).map((p) => ({
  id: p.id,
  slug: p.id,
  name: p.name,
  city: p.city,
  type: p.type,
  status: p.status,
  image_url: p.image,
}));

const normalizeStatus = (status: string) => (status === "in_progress" ? "inProgress" : status);

export function FeaturedProjects() {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState<ProjectRow[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("id, slug, name, city, type, status, image_url")
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) {
          setFeatured(fallbackFeatured);
          return;
        }

        const rows = (data as ProjectRow[]) || [];
        setFeatured(rows.length > 0 ? rows : fallbackFeatured);
      } catch {
        setFeatured(fallbackFeatured);
      }
    };

    fetchFeatured();
  }, []);

  const statusColors: Record<string, string> = {
    upcoming: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    in_progress: "bg-accent/10 text-accent",
    inProgress: "bg-accent/10 text-accent",
    delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("featured.sectionTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("featured.sectionSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/projects/${project.id}`}
                className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={resolveProjectImage(project)}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className={`absolute top-3 start-3 ${statusColors[project.status] || statusColors.inProgress}`}>
                    {t(`featured.status.${normalizeStatus(project.status)}`)}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold">{project.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {project.city}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/projects">
              {t("featured.viewAll")}
              <ArrowRight className="ms-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
