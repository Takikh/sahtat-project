import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

type QuoteStatus = "new" | "in_review" | "quoted" | "closed";
type OfferStatus = "new" | "in_review" | "visit_planned" | "negotiation" | "rejected" | "approved";

type QuoteRow = {
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
  projects: { name: string } | { name: string }[] | null;
};

type OfferRow = {
  status: OfferStatus;
  submitted_at: string;
  updated_at: string;
};

const quoteStatusOrder: QuoteStatus[] = ["new", "in_review", "quoted", "closed"];
const offerStatusOrder: OfferStatus[] = ["new", "in_review", "visit_planned", "negotiation", "approved", "rejected"];

export function AdminReporting() {
  const [range, setRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [offers, setOffers] = useState<OfferRow[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - Number(range));
    const sinceIso = since.toISOString();

    const [quotesRes, offersRes] = await Promise.all([
      supabase
        .from("project_quote_requests")
        .select("status, created_at, updated_at, projects(name)")
        .gte("created_at", sinceIso),
      supabase
        .from("land_offers")
        .select("status, submitted_at, updated_at")
        .gte("submitted_at", sinceIso),
    ]);

    setQuotes((quotesRes.data as QuoteRow[]) || []);
    setOffers((offersRes.data as OfferRow[]) || []);
    setLoading(false);
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const quoteFunnel = useMemo(() => {
    const counts: Record<QuoteStatus, number> = {
      new: 0,
      in_review: 0,
      quoted: 0,
      closed: 0,
    };

    quotes.forEach((quote) => {
      counts[quote.status] += 1;
    });

    return quoteStatusOrder.map((status) => ({
      status,
      count: counts[status],
    }));
  }, [quotes]);

  const offerFlow = useMemo(() => {
    const counts: Record<OfferStatus, number> = {
      new: 0,
      in_review: 0,
      visit_planned: 0,
      negotiation: 0,
      approved: 0,
      rejected: 0,
    };

    offers.forEach((offer) => {
      counts[offer.status] += 1;
    });

    return offerStatusOrder.map((status) => ({
      status,
      count: counts[status],
    }));
  }, [offers]);

  const staleQuotes = useMemo(() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 14);

    return quotes.filter((quote) => {
      if (quote.status === "closed") return false;
      return new Date(quote.updated_at) < threshold;
    }).length;
  }, [quotes]);

  const staleOffers = useMemo(() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 21);

    return offers.filter((offer) => {
      if (offer.status === "approved" || offer.status === "rejected") return false;
      return new Date(offer.updated_at) < threshold;
    }).length;
  }, [offers]);

  const topProjects = useMemo(() => {
    const map: Record<string, number> = {};

    quotes.forEach((quote) => {
      const name = Array.isArray(quote.projects) ? (quote.projects[0]?.name || "Unknown") : (quote.projects?.name || "Unknown");
      map[name] = (map[name] || 0) + 1;
    });

    return Object.entries(map)
      .map(([project, count]) => ({ project, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [quotes]);

  const totalQuotes = quotes.length;
  const totalOffers = offers.length;
  const quoteConversion = totalQuotes > 0 ? Math.round(((quoteFunnel.find((item) => item.status === "closed")?.count || 0) / totalQuotes) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}><CardContent className="p-5"><Skeleton className="h-10 w-full" /></CardContent></Card>
          ))}
        </div>
        <Card><CardContent className="p-5"><Skeleton className="h-[280px] w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Lead Reporting</h2>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Quote requests</p>
            <p className="text-2xl font-bold">{totalQuotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Land offers</p>
            <p className="text-2xl font-bold">{totalOffers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Quote conversion</p>
            <p className="text-2xl font-bold">{quoteConversion}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Stale leads</p>
            <p className="text-2xl font-bold">{staleQuotes + staleOffers}</p>
            <p className="text-xs text-muted-foreground">{staleQuotes} quotes • {staleOffers} land offers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Quote funnel</CardTitle></CardHeader>
          <CardContent>
            {quoteFunnel.every((item) => item.count === 0) ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No quote data for this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={quoteFunnel}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Land offer flow</CardTitle></CardHeader>
          <CardContent>
            {offerFlow.every((item) => item.count === 0) ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No land offer data for this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={offerFlow}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Top projects by quote demand</CardTitle></CardHeader>
        <CardContent>
          {topProjects.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No project quote activity for this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topProjects} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="project" width={140} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
