import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Building2, LogOut, Shield } from "lucide-react";

interface PurchasedProperty {
  id: string;
  unit_number: string | null;
  purchase_date: string | null;
  progress_percent: number | null;
  status: string | null;
  projects: { name: string; city: string; image_url: string | null } | null;
}

interface ProgressUpdate {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  progress_percent: number | null;
  update_date: string;
}

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PurchasedProperty[]>([]);
  const [progressUpdates, setProgressUpdates] = useState<Record<string, ProgressUpdate[]>>({});
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  const canAccessAdmin = isAdmin;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      const [propRes, profileRes] = await Promise.all([
        supabase
          .from("purchased_properties")
          .select("*, projects(name, city, image_url)")
          .eq("user_id", user.id),
        supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("user_id", user.id)
          .single(),
      ]);

      if (propRes.data) {
        const propertiesData = propRes.data as PurchasedProperty[];
        setProperties(propertiesData);
        // Fetch progress for each property
        const progressPromises = propertiesData.map((p) =>
          supabase
            .from("construction_progress")
            .select("*")
            .eq("purchased_property_id", p.id)
            .order("update_date", { ascending: false })
        );
        const progressResults = await Promise.all(progressPromises);
        const progressMap: Record<string, ProgressUpdate[]> = {};
        propertiesData.forEach((p, i) => {
          progressMap[p.id] = (progressResults[i].data as ProgressUpdate[]) || [];
        });
        setProgressUpdates(progressMap);
      }
      if (profileRes.data) setProfile(profileRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const statusColors: Record<string, string> = {
    in_progress: "bg-accent/10 text-accent",
    completed: "bg-green-500/10 text-green-600",
    pending: "bg-blue-500/10 text-blue-600",
  };

  const locale = i18n.language === "fr" ? "fr-DZ" : i18n.language === "ar" ? "ar-DZ" : "en-US";

  return (
    <Layout>
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl font-bold"
            >
              {t("dashboard.welcome", { name: profile?.full_name || user?.email || "" })}
            </motion.h1>
            <p className="mt-1 opacity-80">{t("dashboard.title")}</p>
          </div>
          <div className="flex gap-2">
            {canAccessAdmin && (
              <Button asChild className="bg-white text-primary font-semibold hover:bg-white/90">
                <Link to="/admin">
                  <Shield className="me-2 h-4 w-4" />
                  {t("dashboard.adminPanel")}
                </Link>
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleSignOut}
              className="bg-white text-primary font-semibold hover:bg-white/90"
            >
              <LogOut className="me-2 h-4 w-4" />
              {t("dashboard.signOut")}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-44" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="mt-6 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-2.5 w-full" />
                  </div>
                  <div className="mt-6 space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h2 className="mt-4 font-display text-xl font-semibold">{t("dashboard.noPropertiesTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("dashboard.noPropertiesText")}
              </p>
              <Button asChild className="mt-6 bg-accent text-accent-foreground">
                <Link to="/projects">{t("dashboard.browseProjects")}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {properties.map((prop) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg font-semibold">
                          {prop.projects?.name || t("dashboard.propertyFallback", "Property")}
                        </h3>
                        <p className="text-sm text-muted-foreground">{prop.projects?.city}</p>
                        {prop.unit_number && (
                          <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.unit")}: {prop.unit_number}</p>
                        )}
                      </div>
                      <Badge className={statusColors[prop.status || "pending"]}>
                        {t(`dashboard.status.${prop.status || "pending"}`, { defaultValue: (prop.status || "pending").replace("_", " ") })}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>{t("dashboard.constructionProgress")}</span>
                        <span className="font-semibold">{prop.progress_percent || 0}%</span>
                      </div>
                      <Progress value={prop.progress_percent || 0} className="mt-2" />
                    </div>

                    {/* Progress Updates */}
                    {progressUpdates[prop.id]?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-3 text-sm font-semibold">{t("dashboard.recentUpdates")}</h4>
                        <div className="mt-3 space-y-4">
                          {progressUpdates[prop.id].slice(0, 5).map((update) => (
                            <div key={update.id} className="rounded-lg border border-border bg-background overflow-hidden">
                              {update.image_url && (
                                <img
                                  src={update.image_url}
                                  alt={update.title}
                                  className="w-full h-40 object-cover"
                                />
                              )}
                              <div className="p-3 border-s-2 border-accent">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{update.title}</p>
                                  {update.progress_percent !== null && (
                                    <span className="text-xs font-semibold text-accent">{update.progress_percent}%</span>
                                  )}
                                </div>
                                {update.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{update.description}</p>
                                )}
                                <p className="mt-1 text-xs text-muted-foreground">{new Date(update.update_date).toLocaleDateString(locale)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
