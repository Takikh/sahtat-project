import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, CheckCircle, Layers, MapPin, Scale, Wallet, Video, FileText, MessageCircle, PhoneCall } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { resolveProjectImage } from "@/lib/projectImage";
import { trackProjectView } from "@/hooks/usePageTracking";
import { formatAreaRange, formatPriceRange, pickLocalized, toStringArray, toTimeline } from "@/lib/projectContent";
import { useSeo } from "@/hooks/useSeo";

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
  status: string;
  image_url: string | null;
  description_en: string | null;
  description_fr: string | null;
  description_ar: string | null;
  features: unknown;
  location: string | null;
  price_min_dzd: number | null;
  price_max_dzd: number | null;
  area_min_m2: number | null;
  area_max_m2: number | null;
  total_units: number | null;
  units_left: number | null;
  delivery_date: string | null;
  payment_plan_en: string | null;
  payment_plan_fr: string | null;
  payment_plan_ar: string | null;
  what_en: string | null;
  what_fr: string | null;
  what_ar: string | null;
  for_whom_en: string | null;
  for_whom_fr: string | null;
  for_whom_ar: string | null;
  why_now_en: string | null;
  why_now_fr: string | null;
  why_now_ar: string | null;
  included_en: string | null;
  included_fr: string | null;
  included_ar: string | null;
  guarantee_en: string | null;
  guarantee_fr: string | null;
  guarantee_ar: string | null;
  gallery_urls: unknown;
  floor_plan_urls: unknown;
  short_video_url: string | null;
  construction_timeline: unknown;
  seo_title_en: string | null;
  seo_title_fr: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_fr: string | null;
  seo_description_ar: string | null;
}

const normalizeStatus = (status: string) => (status === "in_progress" ? "inProgress" : status);

const ProjectDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const locale = lang === "fr" ? "fr-DZ" : lang === "ar" ? "ar-DZ" : "en-US";
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!project?.id) return;
    trackProjectView(project.id);
  }, [project?.id]);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      const bySlug = await supabase
        .from("projects")
        .select("*")
        .eq("slug", id)
        .maybeSingle();

      if (bySlug.error) {
        setProject(null);
        setLoading(false);
        return;
      }

      if (bySlug.data) {
        setProject(bySlug.data as ProjectRow);
        setLoading(false);
        return;
      }

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

  const mediaSlides = useMemo(() => {
    if (!project) return [];
    const gallery = toStringArray(project.gallery_urls as never);
    const cover = resolveProjectImage(project);
    return [cover, ...gallery.filter((item) => item !== cover)];
  }, [project]);

  const floorPlans = project ? toStringArray(project.floor_plan_urls as never) : [];
  const timeline = project ? toTimeline(project.construction_timeline as never) : [];
  const features = project ? toStringArray(project.features as never) : [];

  const title = project
    ? pickLocalized(lang, project.seo_title_en || project.name, project.seo_title_fr, project.seo_title_ar)
    : "";
  const description = project
    ? pickLocalized(lang, project.seo_description_en || project.description_en, project.seo_description_fr, project.seo_description_ar)
    : "";

  useSeo({
    title: project ? `${title || project.name} | Sahtat Promotion` : "Sahtat Promotion",
    description,
    canonicalPath: project ? `/projects/${project.slug || project.id}` : "/projects",
    image: mediaSlides[0] || null,
    type: "website",
  });

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

  const localizedDescription = pickLocalized(lang, project.description_en, project.description_fr, project.description_ar);
  const whatText = pickLocalized(lang, project.what_en, project.what_fr, project.what_ar);
  const forWhomText = pickLocalized(lang, project.for_whom_en, project.for_whom_fr, project.for_whom_ar);
  const whyNowText = pickLocalized(lang, project.why_now_en, project.why_now_fr, project.why_now_ar);
  const includedText = pickLocalized(lang, project.included_en, project.included_fr, project.included_ar);
  const paymentPlanText = pickLocalized(lang, project.payment_plan_en, project.payment_plan_fr, project.payment_plan_ar);
  const guaranteeText = pickLocalized(lang, project.guarantee_en, project.guarantee_fr, project.guarantee_ar);

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

          <div className="grid gap-8 xl:grid-cols-[1.45fr_1fr]">
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-border bg-card p-3">
                <Carousel opts={{ loop: mediaSlides.length > 1 }}>
                  <CarouselContent>
                    {mediaSlides.map((media, index) => (
                      <CarouselItem key={`${media}-${index}`}>
                        <div className="aspect-[16/10] overflow-hidden rounded-xl">
                          <img src={media} alt={`${project.name} ${index + 1}`} className="h-full w-full object-cover" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {mediaSlides.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4 top-1/2" />
                      <CarouselNext className="right-4 top-1/2" />
                    </>
                  )}
                </Carousel>
              </motion.div>

              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-2xl font-semibold">{t("projects.description")}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{localizedDescription}</p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {whatText && (
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-sm font-semibold">{t("projects.structuredWhat", "What")}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{whatText}</p>
                    </div>
                  )}
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm font-semibold">{t("projects.structuredWhere", "Where")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{project.location || project.city}</p>
                  </div>
                  {forWhomText && (
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-sm font-semibold">{t("projects.structuredForWhom", "For whom")}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{forWhomText}</p>
                    </div>
                  )}
                  {whyNowText && (
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-sm font-semibold">{t("projects.structuredWhyNow", "Why now")}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{whyNowText}</p>
                    </div>
                  )}
                </div>

                {includedText && (
                  <div className="mt-4 rounded-lg border border-border p-4">
                    <p className="text-sm font-semibold">{t("projects.structuredIncluded", "What is included")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{includedText}</p>
                  </div>
                )}
              </section>

              {features.length > 0 && (
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-2xl font-semibold">{t("projects.features")}</h2>
                  <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {floorPlans.length > 0 && (
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-2xl font-semibold">{t("projects.floorPlans", "Floor plans")}</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {floorPlans.map((url, index) => {
                      const isPdf = /\.pdf($|\?)/i.test(url);
                      return (
                        <a
                          key={`${url}-${index}`}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group overflow-hidden rounded-lg border border-border"
                        >
                          {isPdf ? (
                            <div className="flex h-36 items-center justify-center bg-secondary text-sm font-medium text-muted-foreground">
                              <FileText className="me-2 h-5 w-5" /> PDF floor plan
                            </div>
                          ) : (
                            <img src={url} alt={`Floor plan ${index + 1}`} className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}

              {timeline.length > 0 && (
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-2xl font-semibold">{t("projects.timeline", "Construction timeline")}</h2>
                  <div className="mt-5 space-y-4">
                    {timeline.map((entry, index) => (
                      <div key={`${entry.date}-${index}`} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-accent" />
                          {index < timeline.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-xs font-semibold text-accent">{entry.date}</p>
                          <p className="text-sm font-medium">{pickLocalized(lang, entry.title_en, entry.title_fr, entry.title_ar)}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {entry.status || ""}
                            {entry.progress !== undefined ? ` • ${entry.progress}%` : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {project.short_video_url && (
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-2xl font-semibold">{t("projects.video", "Project video")}</h2>
                  <a
                    href={project.short_video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
                  >
                    <Video className="h-4 w-4" />
                    {t("projects.watchVideo", "Watch video")}
                  </a>
                </section>
              )}
            </div>

            <motion.aside initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 xl:sticky xl:top-24 xl:self-start">
              <div className="rounded-2xl border border-border bg-card p-6">
                <Badge className={statusColors[project.status] || statusColors.inProgress}>
                  {t(`featured.status.${normalizeStatus(project.status)}`)}
                </Badge>
                <h1 className="mt-4 font-display text-3xl font-bold">{project.name}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {project.location || project.city}
                </p>

                <div className="mt-6 space-y-2 rounded-lg border border-border bg-background p-4 text-sm">
                  <p className="inline-flex items-center gap-2"><Wallet className="h-4 w-4" />{formatPriceRange(project.price_min_dzd, project.price_max_dzd, locale) || "N/A"}</p>
                  <p className="inline-flex items-center gap-2"><Scale className="h-4 w-4" />{formatAreaRange(project.area_min_m2, project.area_max_m2, locale) || "N/A"}</p>
                  <p className="inline-flex items-center gap-2"><Layers className="h-4 w-4" />{project.units_left !== null ? `${project.units_left}/${project.total_units || "?"} available` : "N/A"}</p>
                  <p className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />{project.delivery_date || "N/A"}</p>
                </div>

                {paymentPlanText && (
                  <div className="mt-4 rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">{t("projects.paymentPlan", "Payment plan")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{paymentPlanText}</p>
                  </div>
                )}

                {guaranteeText && (
                  <div className="mt-3 rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">{t("projects.deliveryGuarantee", "Delivery guarantee")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{guaranteeText}</p>
                  </div>
                )}

                <div className="mt-5 grid gap-2">
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to={`/contact?project=${project.slug}`}>{t("projects.bookVisit", "Book a visit")}</Link>
                  </Button>
                  <a href="https://wa.me/213660840271" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="container grid grid-cols-2 gap-2">
          <a href="tel:+213660840271" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium">
            <PhoneCall className="h-4 w-4" />
            Call
          </a>
          <Link to={`/contact?project=${project.slug}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground">
            <CalendarDays className="h-4 w-4" />
            Visit
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
