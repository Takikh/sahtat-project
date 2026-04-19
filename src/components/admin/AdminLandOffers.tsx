import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { exportToCsv } from "@/lib/csvExport";

type OfferStatus = "new" | "in_review" | "visit_planned" | "negotiation" | "rejected" | "approved";
type StaffRole = "secretary" | "admin" | "super_admin";

interface LandOfferRow {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string;
  district: string | null;
  area_m2: number | null;
  asking_price: number | null;
  ownership_type: string | null;
  description: string | null;
  internal_notes: string | null;
  assigned_to_user_id: string | null;
  last_contacted_at: string | null;
  status: OfferStatus;
  is_read: boolean;
  submitted_at: string;
  updated_at: string;
}

type StaffOption = {
  user_id: string;
  full_name: string | null;
  role: StaffRole;
};

const statusColor: Record<OfferStatus, string> = {
  new: "bg-blue-500/10 text-blue-600",
  in_review: "bg-amber-500/10 text-amber-600",
  visit_planned: "bg-violet-500/10 text-violet-600",
  negotiation: "bg-orange-500/10 text-orange-600",
  approved: "bg-green-500/10 text-green-600",
  rejected: "bg-destructive/10 text-destructive",
};

const rolePriority: Record<StaffRole, number> = {
  super_admin: 0,
  admin: 1,
  secretary: 2,
};

export function AdminLandOffers() {
  const { toast } = useToast();
  const [offers, setOffers] = useState<LandOfferRow[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OfferStatus>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<"none" | OfferStatus>("none");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("land_offers")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setOffers([]);
      setLoading(false);
      return;
    }

    const rows = (data as LandOfferRow[]) || [];
    setOffers(rows);
    setNoteDrafts(Object.fromEntries(rows.map((offer) => [offer.id, offer.internal_notes || ""])));
    setLoading(false);
  }, [toast]);

  const fetchStaff = useCallback(async () => {
    const [rolesRes, profilesRes] = await Promise.all([
      supabase.from("user_roles").select("user_id, role").in("role", ["secretary", "admin", "super_admin"]),
      supabase.from("profiles").select("user_id, full_name"),
    ]);

    if (rolesRes.error || profilesRes.error) return;

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

    setStaff(Array.from(dedup.values()).sort((a, b) => (a.full_name || "").localeCompare(b.full_name || "")));
  }, []);

  useEffect(() => {
    fetchOffers();
    fetchStaff();
  }, [fetchOffers, fetchStaff]);

  const updateOffer = async (id: string, payload: Partial<LandOfferRow>) => {
    const { error } = await supabase.from("land_offers").update(payload).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    await fetchOffers();
    return true;
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return offers.filter((offer) => {
      if (statusFilter !== "all" && offer.status !== statusFilter) return false;

      if (fromDate) {
        const submitted = new Date(offer.submitted_at);
        const start = new Date(`${fromDate}T00:00:00`);
        if (submitted < start) return false;
      }

      if (toDate) {
        const submitted = new Date(offer.submitted_at);
        const end = new Date(`${toDate}T23:59:59`);
        if (submitted > end) return false;
      }

      if (!query) return true;

      return [
        offer.full_name,
        offer.phone,
        offer.email || "",
        offer.city,
        offer.district || "",
        offer.description || "",
        offer.internal_notes || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [offers, search, statusFilter, fromDate, toDate]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => filtered.some((offer) => offer.id === id)));
  }, [filtered]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((offer) => selectedIds.includes(offer.id));

  const toggleSelectAllVisible = (checked: boolean) => {
    if (!checked) {
      setSelectedIds((prev) => prev.filter((id) => !filtered.some((offer) => offer.id === id)));
      return;
    }
    const ids = filtered.map((offer) => offer.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const bulkSetStatus = async () => {
    if (!selectedIds.length || bulkStatus === "none") return;
    const { error } = await supabase
      .from("land_offers")
      .update({ status: bulkStatus, is_read: true })
      .in("id", selectedIds);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setSelectedIds([]);
    setBulkStatus("none");
    await fetchOffers();
  };

  const exportFiltered = () => {
    if (!filtered.length) {
      toast({ title: "No data", description: "No land offers available for current filters." });
      return;
    }

    exportToCsv(
      filtered.map((offer) => ({
        submitted_at: offer.submitted_at,
        full_name: offer.full_name,
        phone: offer.phone,
        email: offer.email || "",
        city: offer.city,
        district: offer.district || "",
        area_m2: offer.area_m2 || "",
        asking_price: offer.asking_price || "",
        ownership_type: offer.ownership_type || "",
        status: offer.status,
        assigned_to_user_id: offer.assigned_to_user_id || "",
        last_contacted_at: offer.last_contacted_at || "",
        internal_notes: offer.internal_notes || "",
      })),
      `land-offers-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  };

  const saveNote = async (id: string) => {
    await updateOffer(id, { internal_notes: noteDrafts[id] || "" });
  };

  const setContactNow = async (id: string) => {
    await updateOffer(id, { last_contacted_at: new Date().toISOString(), is_read: true });
  };

  const staffLabel = useMemo(
    () =>
      Object.fromEntries(
        staff.map((member) => [member.user_id, `${member.full_name || "Unnamed"} (${member.role.replace("_", " ")})`]),
      ),
    [staff],
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Land Offers ({offers.length})</h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={exportFiltered}><Download className="h-4 w-4" />Export CSV</Button>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, phone, city, notes..." />
        <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
        <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
        <div className="flex gap-2">
          <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>All</Button>
          <Button variant={statusFilter === "new" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("new")}>New</Button>
          <Button variant={statusFilter === "in_review" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("in_review")}>Review</Button>
          <Button variant={statusFilter === "visit_planned" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("visit_planned")}>Visit</Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setSearch(""); setFromDate(""); setToDate(""); setStatusFilter("all"); }}>Reset</Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-card p-3">
        <Checkbox checked={allVisibleSelected} onCheckedChange={(value) => toggleSelectAllVisible(Boolean(value))} />
        <p className="text-sm text-muted-foreground">Select all visible rows ({filtered.length})</p>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
          <p className="text-sm text-muted-foreground">{selectedIds.length} selected</p>
          <Select value={bulkStatus} onValueChange={(value) => setBulkStatus(value as "none" | OfferStatus)}>
            <SelectTrigger className="h-8 w-44 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Set status</SelectItem>
              <SelectItem value="new">new</SelectItem>
              <SelectItem value="in_review">in_review</SelectItem>
              <SelectItem value="visit_planned">visit_planned</SelectItem>
              <SelectItem value="negotiation">negotiation</SelectItem>
              <SelectItem value="approved">approved</SelectItem>
              <SelectItem value="rejected">rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={bulkSetStatus} disabled={bulkStatus === "none"}>Apply</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>Clear</Button>
        </div>
      )}

      {loading ? (
        <p className="py-8 text-center text-muted-foreground">Loading land offers...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((offer) => (
            <div key={offer.id} className={`rounded-lg border p-4 ${offer.is_read ? "border-border bg-card" : "border-accent bg-card"}`}>
              <div className="mb-3 flex items-center gap-3">
                <Checkbox
                  checked={selectedIds.includes(offer.id)}
                  onCheckedChange={(value) => {
                    const checked = Boolean(value);
                    setSelectedIds((prev) => {
                      if (checked) return Array.from(new Set([...prev, offer.id]));
                      return prev.filter((id) => id !== offer.id);
                    });
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{offer.full_name}</p>
                  {!offer.is_read && <Badge className="bg-accent text-accent-foreground">new</Badge>}
                  <Badge className={statusColor[offer.status]}>{offer.status}</Badge>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{offer.phone}{offer.email ? ` • ${offer.email}` : ""}</p>
                  <p className="text-sm">{offer.city}{offer.district ? ` • ${offer.district}` : ""}</p>
                  <p className="text-xs text-muted-foreground">
                    {offer.area_m2 ? `${offer.area_m2} m2` : "Area n/a"}
                    {offer.asking_price ? ` • ${offer.asking_price} DZD` : ""}
                    {offer.ownership_type ? ` • ${offer.ownership_type}` : ""}
                  </p>
                  {offer.description && <p className="text-sm text-muted-foreground">{offer.description}</p>}
                  <p className="text-xs text-muted-foreground">Submitted: {new Date(offer.submitted_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Updated: {new Date(offer.updated_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Last contacted: {offer.last_contacted_at ? new Date(offer.last_contacted_at).toLocaleString() : "n/a"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Select value={offer.status} onValueChange={(value) => updateOffer(offer.id, { status: value as OfferStatus, is_read: true })}>
                      <SelectTrigger className="h-8 w-44 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">new</SelectItem>
                        <SelectItem value="in_review">in_review</SelectItem>
                        <SelectItem value="visit_planned">visit_planned</SelectItem>
                        <SelectItem value="negotiation">negotiation</SelectItem>
                        <SelectItem value="approved">approved</SelectItem>
                        <SelectItem value="rejected">rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => setContactNow(offer.id)}>Contacted now</Button>
                  </div>

                  <Select
                    value={offer.assigned_to_user_id || "none"}
                    onValueChange={(value) => updateOffer(offer.id, { assigned_to_user_id: value === "none" ? null : value })}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Assign to staff" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {staff.map((member) => (
                        <SelectItem key={member.user_id} value={member.user_id}>{staffLabel[member.user_id]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    value={noteDrafts[offer.id] || ""}
                    onChange={(event) =>
                      setNoteDrafts((prev) => ({
                        ...prev,
                        [offer.id]: event.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Internal negotiation/follow-up notes..."
                  />
                  <Button size="sm" variant="outline" onClick={() => saveNote(offer.id)}>Save note</Button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && <p className="py-8 text-center text-muted-foreground">No land offers found.</p>}
        </div>
      )}
    </div>
  );
}
