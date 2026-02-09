import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Building2, FileText, User, LogOut, Shield } from "lucide-react";

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
  progress_percent: number | null;
  update_date: string;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, isAdmin, signOut } = useAuth();
  const [properties, setProperties] = useState<PurchasedProperty[]>([]);
  const [progressUpdates, setProgressUpdates] = useState<Record<string, ProgressUpdate[]>>({});
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

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
        setProperties(propRes.data as any);
        // Fetch progress for each property
        const progressPromises = propRes.data.map((p: any) =>
          supabase
            .from("construction_progress")
            .select("*")
            .eq("purchased_property_id", p.id)
            .order("update_date", { ascending: false })
        );
        const progressResults = await Promise.all(progressPromises);
        const progressMap: Record<string, ProgressUpdate[]> = {};
        propRes.data.forEach((p: any, i: number) => {
          progressMap[p.id] = (progressResults[i].data as any) || [];
        });
        setProgressUpdates(progressMap);
      }
      if (profileRes.data) setProfile(profileRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const statusColors: Record<string, string> = {
    in_progress: "bg-accent/10 text-accent",
    completed: "bg-green-500/10 text-green-600",
    pending: "bg-blue-500/10 text-blue-600",
  };

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
              Welcome, {profile?.full_name || user?.email}
            </motion.h1>
            <p className="mt-1 opacity-80">Client Dashboard</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button asChild variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/admin">
                  <Shield className="me-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={signOut}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="me-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : properties.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h2 className="mt-4 font-display text-xl font-semibold">No Properties Yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Once you purchase a property, you'll be able to track its progress here.
              </p>
              <Button asChild className="mt-6 bg-accent text-accent-foreground">
                <Link to="/projects">Browse Projects</Link>
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
                          {prop.projects?.name || "Property"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{prop.projects?.city}</p>
                        {prop.unit_number && (
                          <p className="mt-1 text-sm text-muted-foreground">Unit: {prop.unit_number}</p>
                        )}
                      </div>
                      <Badge className={statusColors[prop.status || "pending"]}>
                        {prop.status?.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Construction Progress</span>
                        <span className="font-semibold">{prop.progress_percent || 0}%</span>
                      </div>
                      <Progress value={prop.progress_percent || 0} className="mt-2" />
                    </div>

                    {/* Progress Updates */}
                    {progressUpdates[prop.id]?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold">Recent Updates</h4>
                        <div className="mt-3 space-y-3">
                          {progressUpdates[prop.id].slice(0, 3).map((update) => (
                            <div key={update.id} className="border-s-2 border-accent ps-3">
                              <p className="text-sm font-medium">{update.title}</p>
                              {update.description && (
                                <p className="text-xs text-muted-foreground">{update.description}</p>
                              )}
                              <p className="mt-1 text-xs text-muted-foreground">{update.update_date}</p>
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
