import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const types = ["All", "apartment", "villa", "commercial"];
const statuses = ["All", "upcoming", "inProgress", "delivered"];

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
  type: string;
  status: string;
  image_url: string | null;
  description_en: string | null;
  description_fr: string | null;
  description_ar: string | null;
  features: string[] | null;
  location: string | null;
}

const normalizeStatus = (status: string) => (status === "in_progress" ? "inProgress" : status);

const Projects = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      setProjects((data as ProjectRow[]) || []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(projects.map((p) => p.city).filter(Boolean)));
    return ["All", ...uniqueCities];
  }, [projects]);

  const filtered = projects.filter((p) => {
    if (cityFilter !== "All" && p.city !== cityFilter) return false;
    if (typeFilter !== "All" && p.type !== typeFilter) return false;
    if (statusFilter !== "All" && normalizeStatus(p.status) !== statusFilter) return false;
    return true;
  });

  return (
    <Layout>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold sm:text-5xl"
          >
            {t("projects.title")}
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl opacity-80">{t("projects.subtitle")}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 rounded-xl bg-secondary p-4">
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Button
                  key={city}
                  variant={cityFilter === city ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCityFilter(city)}
                  className={cityFilter === city ? "bg-accent text-accent-foreground" : ""}
                >
                  {city === "All" ? t("projects.filterAll") : city}
                </Button>
              ))}
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                  className={typeFilter === type ? "bg-accent text-accent-foreground" : ""}
                >
                  {type === "All" ? t("projects.filterAll") : t(`projects.${type}`)}
                </Button>
              ))}
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className={statusFilter === s ? "bg-accent text-accent-foreground" : ""}
                >
                  {s === "All" ? t("projects.filterAll") : t(`featured.status.${s}`)}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Loading projects...</div>
          ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className={`absolute top-3 start-3 ${statusColors[project.status] || statusColors.inProgress}`}>
                      {t(`featured.status.${normalizeStatus(project.status)}`)}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{project.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {project.location || project.city}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {(lang === "fr" ? project.description_fr : lang === "ar" ? project.description_ar : project.description_en) || project.description_en}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(project.features || []).slice(0, 3).map((f) => (
                        <span key={f} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          )}

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No projects found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
