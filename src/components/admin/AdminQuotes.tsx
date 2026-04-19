import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type QuoteStatus = "new" | "in_review" | "quoted" | "closed";

type QuoteRow = {
  id: string;
  project_id: string;
  full_name: string;
  email: string;
  phone: string;
  profession: string | null;
  financing_type: string | null;
  wilaya: string | null;
  desired_apartment_type: string | null;
  parking_needed: boolean | null;
  budget_min_dzd: number | null;
  budget_max_dzd: number | null;
  preferred_contact_method: string | null;
  message: string | null;
  status: QuoteStatus;
  is_read: boolean;
  created_at: string;
  projects: { name: string } | { name: string }[] | null;
};

const statusColor: Record<QuoteStatus, string> = {
  new: "bg-blue-500/10 text-blue-600",
  in_review: "bg-amber-500/10 text-amber-600",
  quoted: "bg-green-500/10 text-green-600",
  closed: "bg-muted text-muted-foreground",
};

const projectNameFromRel = (projects: QuoteRow["projects"]) => {
  if (!projects) return "Unknown project";
  return Array.isArray(projects) ? (projects[0]?.name || "Unknown project") : projects.name;
};

export function AdminQuotes() {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | QuoteStatus>("all");

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("project_quote_requests")
      .select("*, projects(name)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setQuotes([]);
      setLoading(false);
      return;
    }

    setQuotes((data as QuoteRow[]) || []);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const updateQuote = async (id: string, payload: Partial<QuoteRow>) => {
    const { error } = await supabase
      .from("project_quote_requests")
      .update(payload)
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    fetchQuotes();
  };

  const deleteQuote = async (id: string) => {
    const { error } = await supabase.from("project_quote_requests").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    fetchQuotes();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return quotes.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;

      if (!q) return true;

      return [
        item.full_name,
        item.email,
        item.phone,
        item.profession || "",
        item.financing_type || "",
        item.wilaya || "",
        item.desired_apartment_type || "",
        item.message || "",
        projectNameFromRel(item.projects),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [quotes, search, statusFilter]);

  const unreadCount = quotes.filter((item) => !item.is_read).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5 text-accent" />
          Quote Requests ({quotes.length})
          {unreadCount > 0 && <Badge className="bg-accent text-accent-foreground">{unreadCount} new</Badge>}
        </h2>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer, project, city, message..."
          className="sm:max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>All</Button>
          <Button variant={statusFilter === "new" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("new")}>New</Button>
          <Button variant={statusFilter === "in_review" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("in_review")}>In Review</Button>
          <Button variant={statusFilter === "quoted" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("quoted")}>Quoted</Button>
          <Button variant={statusFilter === "closed" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("closed")}>Closed</Button>
        </div>
      </div>

      {loading ? (
        <p className="py-8 text-center text-muted-foreground">Loading quote requests...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((quote) => (
            <div key={quote.id} className={`rounded-xl border bg-card p-4 ${quote.is_read ? "border-border" : "border-accent"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{quote.full_name}</p>
                    {!quote.is_read && <Badge className="bg-accent text-accent-foreground">new</Badge>}
                    <Badge className={statusColor[quote.status]}>{quote.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{quote.email} • {quote.phone}</p>
                  <p className="text-sm text-muted-foreground">Project: {projectNameFromRel(quote.projects)}</p>
                  <p className="text-xs text-muted-foreground">
                    {quote.profession || "No profession"}
                    {quote.financing_type ? ` • ${quote.financing_type}` : ""}
                    {quote.wilaya ? ` • ${quote.wilaya}` : ""}
                    {quote.desired_apartment_type ? ` • Type: ${quote.desired_apartment_type}` : ""}
                  </p>
                  {(quote.budget_min_dzd !== null || quote.budget_max_dzd !== null) && (
                    <p className="text-xs text-muted-foreground">
                      Budget: {quote.budget_min_dzd?.toLocaleString() || "?"} - {quote.budget_max_dzd?.toLocaleString() || "?"} DZD
                    </p>
                  )}
                  {quote.message && <p className="mt-2 text-sm">{quote.message}</p>}
                  <p className="text-xs text-muted-foreground">{new Date(quote.created_at).toLocaleString()}</p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                  <Select value={quote.status} onValueChange={(value) => updateQuote(quote.id, { status: value as QuoteStatus, is_read: true })}>
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">new</SelectItem>
                      <SelectItem value="in_review">in_review</SelectItem>
                      <SelectItem value="quoted">quoted</SelectItem>
                      <SelectItem value="closed">closed</SelectItem>
                    </SelectContent>
                  </Select>

                  {!quote.is_read && (
                    <Button variant="outline" size="sm" onClick={() => updateQuote(quote.id, { is_read: true })}>
                      Mark read
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete quote request?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This quote request will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteQuote(quote.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No quote requests found for this filter.</p>
          )}
        </div>
      )}
    </div>
  );
}
