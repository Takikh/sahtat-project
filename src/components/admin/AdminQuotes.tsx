import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Trash2, Download } from "lucide-react";
import { exportToCsv } from "@/lib/csvExport";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type QuoteStatus = "new" | "in_review" | "quoted" | "closed";
type StaffRole = "secretary" | "admin" | "super_admin";

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
  internal_notes: string | null;
  assigned_to_user_id: string | null;
  last_contacted_at: string | null;
  status: QuoteStatus;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  projects: { name: string } | { name: string }[] | null;
};

type StaffOption = {
  user_id: string;
  full_name: string | null;
  role: StaffRole;
};

const statusColor: Record<QuoteStatus, string> = {
  new: "bg-blue-500/10 text-blue-600",
  in_review: "bg-amber-500/10 text-amber-600",
  quoted: "bg-green-500/10 text-green-600",
  closed: "bg-muted text-muted-foreground",
};

const rolePriority: Record<StaffRole, number> = {
  super_admin: 0,
  admin: 1,
  secretary: 2,
};

const projectNameFromRel = (projects: QuoteRow["projects"]) => {
  if (!projects) return "Unknown project";
  return Array.isArray(projects) ? (projects[0]?.name || "Unknown project") : projects.name;
};

export function AdminQuotes() {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | QuoteStatus>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<"none" | QuoteStatus>("none");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

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

    const rows = (data as QuoteRow[]) || [];
    setQuotes(rows);
    setNoteDrafts(Object.fromEntries(rows.map((quote) => [quote.id, quote.internal_notes || ""])));
    setLoading(false);
  }, [toast]);

  const fetchStaff = useCallback(async () => {
    const [rolesRes, profilesRes] = await Promise.all([
      supabase.from("user_roles").select("user_id, role").in("role", ["secretary", "admin", "super_admin"]),
      supabase.from("profiles").select("user_id, full_name"),
    ]);

    if (rolesRes.error || profilesRes.error) {
      return;
    }

    const roleRows = (rolesRes.data || []) as Array<{ user_id: string; role: StaffRole }>;
    const profileMap = new Map(
      ((profilesRes.data || []) as Array<{ user_id: string; full_name: string | null }>).map((profile) => [profile.user_id, profile.full_name]),
    );

    const dedup = new Map<string, StaffOption>();
    roleRows.forEach((row) => {
      const existing = dedup.get(row.user_id);
      if (!existing || rolePriority[row.role] < rolePriority[existing.role]) {
        dedup.set(row.user_id, {
          user_id: row.user_id,
          role: row.role,
          full_name: profileMap.get(row.user_id) || null,
        });
      }
    });

    setStaff(
      Array.from(dedup.values()).sort((a, b) => {
        if (rolePriority[a.role] !== rolePriority[b.role]) {
          return rolePriority[a.role] - rolePriority[b.role];
        }
        return (a.full_name || "").localeCompare(b.full_name || "");
      }),
    );
  }, []);

  useEffect(() => {
    fetchQuotes();
    fetchStaff();
  }, [fetchQuotes, fetchStaff]);

  const updateQuote = async (id: string, payload: Partial<QuoteRow>) => {
    const { error } = await supabase.from("project_quote_requests").update(payload).eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }

    await fetchQuotes();
    return true;
  };

  const deleteQuote = async (id: string) => {
    const { error } = await supabase.from("project_quote_requests").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    await fetchQuotes();
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quotes.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;

      if (fromDate) {
        const created = new Date(item.created_at);
        const start = new Date(`${fromDate}T00:00:00`);
        if (created < start) return false;
      }

      if (toDate) {
        const created = new Date(item.created_at);
        const end = new Date(`${toDate}T23:59:59`);
        if (created > end) return false;
      }

      if (!query) return true;

      return [
        item.full_name,
        item.email,
        item.phone,
        item.profession || "",
        item.financing_type || "",
        item.wilaya || "",
        item.desired_apartment_type || "",
        item.message || "",
        item.internal_notes || "",
        projectNameFromRel(item.projects),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [quotes, search, statusFilter, fromDate, toDate]);

  const unreadCount = quotes.filter((item) => !item.is_read).length;

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => filtered.some((quote) => quote.id === id)));
  }, [filtered]);

  const selectedCount = selectedIds.length;

  const allVisibleSelected = filtered.length > 0 && filtered.every((item) => selectedIds.includes(item.id));

  const toggleSelectAllVisible = (checked: boolean) => {
    if (!checked) {
      setSelectedIds((prev) => prev.filter((id) => !filtered.some((item) => item.id === id)));
      return;
    }

    const ids = filtered.map((item) => item.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const bulkMarkRead = async () => {
    if (!selectedIds.length) return;
    const { error } = await supabase.from("project_quote_requests").update({ is_read: true }).in("id", selectedIds);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setSelectedIds([]);
    await fetchQuotes();
  };

  const bulkSetStatus = async () => {
    if (!selectedIds.length || bulkStatus === "none") return;
    const { error } = await supabase
      .from("project_quote_requests")
      .update({ status: bulkStatus, is_read: true })
      .in("id", selectedIds);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setBulkStatus("none");
    setSelectedIds([]);
    await fetchQuotes();
  };

  const exportFiltered = () => {
    if (!filtered.length) {
      toast({ title: "No data", description: "No quote rows to export for the current filter." });
      return;
    }

    exportToCsv(
      filtered.map((quote) => ({
        created_at: quote.created_at,
        project: projectNameFromRel(quote.projects),
        full_name: quote.full_name,
        email: quote.email,
        phone: quote.phone,
        wilaya: quote.wilaya || "",
        profession: quote.profession || "",
        financing_type: quote.financing_type || "",
        desired_apartment_type: quote.desired_apartment_type || "",
        budget_min_dzd: quote.budget_min_dzd || "",
        budget_max_dzd: quote.budget_max_dzd || "",
        status: quote.status,
        assigned_to_user_id: quote.assigned_to_user_id || "",
        last_contacted_at: quote.last_contacted_at || "",
        internal_notes: quote.internal_notes || "",
      })),
      `quotes-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  };

  const saveInternalNote = async (id: string) => {
    await updateQuote(id, { internal_notes: noteDrafts[id] || "" });
  };

  const setContactNow = async (id: string) => {
    await updateQuote(id, { last_contacted_at: new Date().toISOString(), is_read: true });
  };

  const staffLabelMap = useMemo(
    () =>
      Object.fromEntries(
        staff.map((item) => [item.user_id, `${item.full_name || "Unnamed"} (${item.role.replace("_", " ")})`]),
      ),
    [staff],
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <Mail className="h-5 w-5 text-accent" />
          Quote Requests ({quotes.length})
          {unreadCount > 0 && <Badge className="bg-accent text-accent-foreground">{unreadCount} new</Badge>}
        </h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={exportFiltered}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by customer, project, city, notes..."
        />

        <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
        <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />

        <div className="flex items-center gap-2">
          <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>All</Button>
          <Button variant={statusFilter === "new" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("new")}>New</Button>
          <Button variant={statusFilter === "in_review" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("in_review")}>Review</Button>
          <Button variant={statusFilter === "quoted" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("quoted")}>Quoted</Button>
          <Button variant={statusFilter === "closed" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("closed")}>Closed</Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearch("");
            setFromDate("");
            setToDate("");
            setStatusFilter("all");
          }}
        >
          Reset
        </Button>
      </div>

      {selectedCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
          <p className="text-sm text-muted-foreground">{selectedCount} selected</p>
          <Button size="sm" variant="outline" onClick={bulkMarkRead}>Mark read</Button>
          <Select value={bulkStatus} onValueChange={(value) => setBulkStatus(value as "none" | QuoteStatus)}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Set status</SelectItem>
              <SelectItem value="new">new</SelectItem>
              <SelectItem value="in_review">in_review</SelectItem>
              <SelectItem value="quoted">quoted</SelectItem>
              <SelectItem value="closed">closed</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={bulkSetStatus} disabled={bulkStatus === "none"}>Apply</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>Clear</Button>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-card p-3">
        <Checkbox checked={allVisibleSelected} onCheckedChange={(value) => toggleSelectAllVisible(Boolean(value))} />
        <p className="text-sm text-muted-foreground">Select all visible rows ({filtered.length})</p>
      </div>

      {loading ? (
        <p className="py-8 text-center text-muted-foreground">Loading quote requests...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((quote) => (
            <div key={quote.id} className={`rounded-xl border bg-card p-4 ${quote.is_read ? "border-border" : "border-accent"}`}>
              <div className="mb-3 flex items-center gap-3">
                <Checkbox
                  checked={selectedIds.includes(quote.id)}
                  onCheckedChange={(value) => {
                    const checked = Boolean(value);
                    setSelectedIds((prev) => {
                      if (checked) return Array.from(new Set([...prev, quote.id]));
                      return prev.filter((id) => id !== quote.id);
                    });
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{quote.full_name}</p>
                  {!quote.is_read && <Badge className="bg-accent text-accent-foreground">new</Badge>}
                  <Badge className={statusColor[quote.status]}>{quote.status}</Badge>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr]">
                <div className="space-y-1">
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
                  {quote.message && <p className="mt-1 text-sm">{quote.message}</p>}
                  <p className="text-xs text-muted-foreground">Created: {new Date(quote.created_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Last update: {new Date(quote.updated_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Last contacted: {quote.last_contacted_at ? new Date(quote.last_contacted_at).toLocaleString() : "n/a"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
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

                    <Button variant="outline" size="sm" onClick={() => setContactNow(quote.id)}>
                      Contacted now
                    </Button>

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

                  <Select
                    value={quote.assigned_to_user_id || "none"}
                    onValueChange={(value) => updateQuote(quote.id, { assigned_to_user_id: value === "none" ? null : value })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Assign to staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {staff.map((member) => (
                        <SelectItem key={member.user_id} value={member.user_id}>
                          {staffLabelMap[member.user_id]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    value={noteDrafts[quote.id] || ""}
                    onChange={(event) =>
                      setNoteDrafts((prev) => ({
                        ...prev,
                        [quote.id]: event.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Internal follow-up note..."
                  />
                  <Button size="sm" variant="outline" onClick={() => saveInternalNote(quote.id)}>
                    Save note
                  </Button>
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
