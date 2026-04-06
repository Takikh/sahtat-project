import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
  status: "new" | "in_review" | "visit_planned" | "negotiation" | "rejected" | "approved";
  is_read: boolean;
  submitted_at: string;
}

export function AdminLandOffers() {
  const { toast } = useToast();
  const [offers, setOffers] = useState<LandOfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOffers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("land_offers" as never)
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setOffers(((data || []) as unknown) as LandOfferRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const updateStatus = async (id: string, status: LandOfferRow["status"]) => {
    const { error } = await supabase.from("land_offers" as never).update({ status, is_read: true } as never).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    fetchOffers();
  };

  const filtered = offers.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [o.full_name, o.phone, o.email || "", o.city, o.district || "", o.description || ""]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const statusColor: Record<LandOfferRow["status"], string> = {
    new: "bg-blue-500/10 text-blue-600",
    in_review: "bg-amber-500/10 text-amber-600",
    visit_planned: "bg-violet-500/10 text-violet-600",
    negotiation: "bg-orange-500/10 text-orange-600",
    approved: "bg-green-500/10 text-green-600",
    rejected: "bg-destructive/10 text-destructive",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Land Offers ({offers.length})</h2>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, city..."
          className="w-72"
        />
      </div>

      {loading ? (
        <p className="py-8 text-center text-muted-foreground">Loading land offers...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className={`rounded-lg border p-4 ${o.is_read ? "border-border bg-card" : "border-accent bg-card"}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{o.full_name}</p>
                    {!o.is_read && <Badge className="bg-accent text-accent-foreground">new</Badge>}
                    <Badge className={statusColor[o.status]}>{o.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{o.phone}{o.email ? ` • ${o.email}` : ""}</p>
                  <p className="text-sm">{o.city}{o.district ? ` • ${o.district}` : ""}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.area_m2 ? `${o.area_m2} m²` : "Area n/a"}
                    {o.asking_price ? ` • ${o.asking_price} DZD` : ""}
                    {o.ownership_type ? ` • ${o.ownership_type}` : ""}
                  </p>
                  {o.description && <p className="text-sm text-muted-foreground">{o.description}</p>}
                </div>

                <div className="w-52">
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as LandOfferRow["status"])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">new</SelectItem>
                      <SelectItem value="in_review">in_review</SelectItem>
                      <SelectItem value="visit_planned">visit_planned</SelectItem>
                      <SelectItem value="negotiation">negotiation</SelectItem>
                      <SelectItem value="approved">approved</SelectItem>
                      <SelectItem value="rejected">rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-2 text-xs text-muted-foreground">{new Date(o.submitted_at).toLocaleString()}</p>
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
