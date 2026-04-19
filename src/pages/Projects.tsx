import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, MapPin, Scale, Wallet, CalendarDays, Layers, Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { supabase } from "@/integrations/supabase/client";
import { resolveProjectImage } from "@/lib/projectImage";
import { useToast } from "@/hooks/use-toast";
import { ProjectCityMap } from "@/components/projects/ProjectCityMap";
import { ProjectCompareDialog } from "@/components/projects/ProjectCompareDialog";
import { FaqSection } from "@/components/shared/FaqSection";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { formatAreaRange, formatPriceRange, pickLocalized, toStringArray } from "@/lib/projectContent";
import { useSeo } from "@/hooks/useSeo";

const types = ["All", "apartment", "villa", "commercial"];
const statuses = ["All", "upcoming", "inProgress", "delivered"];
const PROJECTS_PER_PAGE = 6;

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_progress: "bg-accent/10 text-accent",
  inProgress: "bg-accent/10 text-accent",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
};

interface ProjectRow {
  id: string;
  slug: string;
  name: string;
  city: string;
  type: string;
  status: string;
  image_url: string | null;
  description_en: string | null;
  description_fr: string | null;
  description_ar: string | null;
  features: unknown;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  price_min_dzd: number | null;
  price_max_dzd: number | null;
  area_min_m2: number | null;
  area_max_m2: number | null;
  units_left: number | null;
  total_units: number | null;
  delivery_date: string | null;
}

const normalizeStatus = (status: string) => (status === "in_progress" ? "inProgress" : status);

const Projects = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const locale = lang === "fr" ? "fr-DZ" : lang === "ar" ? "ar-DZ" : "en-US";
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useSeo({
    title: `${t("projects.title")} | Sahtat Promotion`,
    description: t("projects.subtitle"),
    canonicalPath: "/projects",
    type: "website",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Projects unavailable",
          description: `Database query failed: ${error.message}`,
          variant: "destructive",
        });
        setProjects([]);
        setLoading(false);
        return;
      }

      const rows = (data as ProjectRow[]) || [];
      if (rows.length === 0) {
        toast({
          title: "No projects found",
          description: "Projects table is empty in this Supabase project. Run the latest migration and seed data.",
        });
      }

      setProjects(rows);
      setLoading(false);
    };

    fetchProjects();
  }, [toast]);

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(projects.map((p) => p.city).filter(Boolean)));
    return ["All", ...uniqueCities];
  }, [projects]);

  const filtered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return projects.filter((project) => {
      if (cityFilter !== "All" && project.city !== cityFilter) return false;
      if (typeFilter !== "All" && project.type !== typeFilter) return false;
      if (statusFilter !== "All" && normalizeStatus(project.status) !== statusFilter) return false;

      if (!needle) return true;

      const description = pickLocalized(lang, project.description_en, project.description_fr, project.description_ar) || "";
      return [project.name, project.city, project.location || "", description]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [projects, cityFilter, typeFilter, statusFilter, searchQuery, lang]);

  useEffect(() => {
    setCurrentPage(1);
  }, [cityFilter, typeFilter, statusFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PROJECTS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (page - 1) * PROJECTS_PER_PAGE;
    return filtered.slice(start, start + PROJECTS_PER_PAGE);
  }, [filtered, page]);

  const compareSelection = projects
    .filter((project) => compareIds.includes(project.id))
    .map((project) => ({
      id: project.id,
      name: project.name,
      location: project.location,
      city: project.city,
      status: normalizeStatus(project.status),
      price_min_dzd: project.price_min_dzd,
      price_max_dzd: project.price_max_dzd,
      area_min_m2: project.area_min_m2,
      area_max_m2: project.area_max_m2,
      units_left: project.units_left,
      delivery_date: project.delivery_date,
    }));

  const toggleCompare = (projectId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(projectId)) return prev.filter((id) => id !== projectId);
      if (prev.length >= 3) {
        toast({
          title: "Comparison limit reached",
          description: "You can compare up to 3 projects at the same time.",
        });
        return prev;
      }
      return [...prev, projectId];
    });
  };

  return (
    <Layout>
      <section className="bg-primary py-20 text-primary-foreground dark:bg-slate-900 dark:text-slate-100">
        <div className="container text-center">
          <PageBreadcrumbs
            className="mb-6 justify-center [&_ol]:justify-center [&_span[aria-current='page']]:text-primary-foreground [&_a]:text-primary-foreground/80 [&_li[role='presentation']]:text-primary-foreground/70"
            items={[
              { label: t("nav.home", "Home"), href: "/" },
              { label: t("projects.title") },
            ]}
          />
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

      <section className="py-12 sm:py-16">
        <div className="container space-y-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">{t("projects.mapBrowseTitle", "Map browse by city")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("projects.mapBrowseSubtitle", "Select a city pin to instantly filter projects and compare local availability.")}</p>
            <div className="mt-4">
              <ProjectCityMap
                projects={projects.map((project) => ({
                  id: project.id,
                  city: project.city,
                  latitude: project.latitude,
                  longitude: project.longitude,
                  name: project.name,
                }))}
                selectedCity={cityFilter}
                onSelectCity={setCityFilter}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 rounded-xl bg-secondary p-4">
            <div className="w-full md:max-w-sm">
              <div className="relative">
                <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("projects.searchPlaceholder", "Search by project name, city, or location")}
                  className="ps-9"
                />
              </div>
            </div>
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
            <div className="hidden h-8 w-px bg-border md:block" />
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
            <div className="hidden h-8 w-px bg-border md:block" />
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? "bg-accent text-accent-foreground" : ""}
                >
                  {status === "All" ? t("projects.filterAll") : t(`featured.status.${status}`)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {t("projects.results", "projects found")} - {t("projects.pageIndicator", "Page")}
              {` ${page}/${totalPages}`}
            </p>
            <ProjectCompareDialog selected={compareSelection} locale={locale} onClear={() => setCompareIds([])} />
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="font-semibold">{t("projects.emptyTitle", "No projects match your filters")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("projects.emptySubtitle", "Try adjusting your city, type, status, or search terms to see available projects.")}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={() => { setCityFilter("All"); setTypeFilter("All"); setStatusFilter("All"); setSearchQuery(""); }}>
                  {t("projects.resetFilters", "Reset filters")}
                </Button>
                <Button variant="outline" onClick={() => setStatusFilter("delivered")}>{t("projects.showDelivered", "Show delivered")}</Button>
                <Button variant="outline" onClick={() => setStatusFilter("inProgress")}>{t("projects.showInProgress", "Show in progress")}</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((project, i) => {
                const selected = compareIds.includes(project.id);
                const description = pickLocalized(lang, project.description_en, project.description_fr, project.description_ar);

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative h-full"
                  >
                    <Button
                      type="button"
                      variant={selected ? "default" : "secondary"}
                      size="sm"
                      className="absolute end-3 top-3 z-20"
                      onClick={() => toggleCompare(project.id)}
                    >
                      {selected ? <Check className="me-1 h-4 w-4" /> : null}
                      {selected ? t("projects.selected", "Selected") : t("projects.compare", "Compare")}
                    </Button>

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
                        <Badge className={`absolute start-3 top-3 ${statusColors[project.status] || statusColors.inProgress}`}>
                          {t(`featured.status.${normalizeStatus(project.status)}`)}
                        </Badge>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-lg font-semibold">{project.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {project.location || project.city}
                        </p>

                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{description}</p>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{formatPriceRange(project.price_min_dzd, project.price_max_dzd, locale) || "N/A"}</div>
                          <div className="inline-flex items-center gap-1"><Scale className="h-3.5 w-3.5" />{formatAreaRange(project.area_min_m2, project.area_max_m2, locale) || "N/A"}</div>
                          <div className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" />{project.units_left !== null ? `${project.units_left} left` : "N/A"}</div>
                          <div className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{project.delivery_date || "N/A"}</div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1">
                          {toStringArray(project.features as never).slice(0, 3).map((feature) => (
                            <span key={feature} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && filtered.length > 0 && totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      if (page > 1) setCurrentPage(page - 1);
                    }}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 text-sm text-muted-foreground">
                    {t("projects.pageIndicator", "Page")} {page} / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      if (page < totalPages) setCurrentPage(page + 1);
                    }}
                    className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </section>

      <FaqSection
        page="projects"
        title={t("projects.faqTitle", "Projects FAQ")}
        subtitle={t("projects.faqSubtitle", "Payment plans, booking documents, handover process, and more.")}
      />
    </Layout>
  );
};

export default Projects;
