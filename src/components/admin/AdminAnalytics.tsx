import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, TrendingUp, Building2, Users } from "lucide-react";

interface DailyViews {
  date: string;
  count: number;
}

interface PageStats {
  page: string;
  views: number;
}

interface ProjectInterest {
  name: string;
  views: number;
}

interface PageViewRow {
  created_at: string;
  page_path: string;
  visitor_id: string | null;
}

interface ProjectViewRow {
  projects: { name: string } | { name: string }[] | null;
}

const COLORS = ["hsl(var(--accent))", "hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

export function AdminAnalytics() {
  const [range, setRange] = useState("30");
  const [dailyViews, setDailyViews] = useState<DailyViews[]>([]);
  const [topPages, setTopPages] = useState<PageStats[]>([]);
  const [projectInterest, setProjectInterest] = useState<ProjectInterest[]>([]);
  const [totals, setTotals] = useState({ views: 0, uniqueVisitors: 0, projectViews: 0, contacts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - parseInt(range));
    const sinceStr = since.toISOString();

    const [pageViewsRes, projectViewsRes, contactsRes] = await Promise.all([
      supabase.from("page_views").select("*").gte("created_at", sinceStr).order("created_at", { ascending: true }),
      supabase.from("project_views").select("*, projects(name)").gte("created_at", sinceStr),
      supabase.from("contact_submissions").select("id").gte("submitted_at", sinceStr),
    ]);

    const pageViews = (pageViewsRes.data || []) as PageViewRow[];
    const projectViews = (projectViewsRes.data || []) as ProjectViewRow[];
    const contacts = contactsRes.data || [];

    // Daily views line chart
    const dailyMap: Record<string, number> = {};
    pageViews.forEach((v) => {
      const day = v.created_at.slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });
    const dailyArr = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    setDailyViews(dailyArr);

    // Top pages bar chart
    const pageMap: Record<string, number> = {};
    pageViews.forEach((v) => {
      const label = v.page_path === "/" ? "Home" : v.page_path.replace("/", "").replace(/\//g, " / ");
      pageMap[label] = (pageMap[label] || 0) + 1;
    });
    const pageArr = Object.entries(pageMap)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);
    setTopPages(pageArr);

    // Project interest pie chart
    const projMap: Record<string, number> = {};
    projectViews.forEach((v) => {
      const name = Array.isArray(v.projects)
        ? (v.projects[0]?.name ?? "Unknown")
        : (v.projects?.name ?? "Unknown");
      projMap[name] = (projMap[name] || 0) + 1;
    });
    const projArr = Object.entries(projMap)
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views);
    setProjectInterest(projArr);

    // Totals
    const uniqueVisitors = new Set(pageViews.map((v) => v.visitor_id)).size;
    setTotals({
      views: pageViews.length,
      uniqueVisitors,
      projectViews: projectViews.length,
      contacts: contacts.length,
    });

    setLoading(false);
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const statCards = [
    { label: "Total Page Views", value: totals.views, icon: Eye, color: "text-accent" },
    { label: "Unique Visitors", value: totals.uniqueVisitors, icon: Users, color: "text-primary" },
    { label: "Project Detail Views", value: totals.projectViews, icon: Building2, color: "text-green-500" },
    { label: "Contact Submissions", value: totals.contacts, icon: TrendingUp, color: "text-amber-500" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-3 h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Site Analytics</h2>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-3 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Views Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily Page Views</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyViews.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No page view data yet. Views will appear as visitors browse the site.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis dataKey="page" type="category" width={100} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Project Interest Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Interest</CardTitle>
          </CardHeader>
          <CardContent>
            {projectInterest.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No project views yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectInterest}
                    dataKey="views"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {projectInterest.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
