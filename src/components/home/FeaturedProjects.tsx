import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { resolveProjectImage } from "@/lib/projectImage";

interface ProjectRow {
  id: string;
  slug?: string;
  name: string;
  city: string;
  type?: string;
  status: string;
  image_url: string | null;
}

const normalizeStatus = (status: string) => (status === "in_progress" ? "inProgress" : status);

export function FeaturedProjects() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const [featured, setFeatured] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, slug, name, city, type, status, image_url")
        .order("created_at", { ascending: false })
        .limit(4);

      setFeatured((data as ProjectRow[]) || []);
      setLoading(false);
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
    <section className="py-16 sm:py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("featured.sectionTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("featured.sectionSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            : featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <Link
                to={`/projects/${project.slug || project.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
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
                <div className="flex flex-1 flex-col p-4">
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
              <ArrowRight className={`ms-2 h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
