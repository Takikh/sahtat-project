import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

interface PurchasedRow {
  id: string;
  user_id: string;
  project_id: string;
  unit_number: string | null;
  purchase_date: string | null;
  progress_percent: number | null;
  status: string | null;
  projects: { name: string } | null;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface ProfileOption {
  user_id: string;
  full_name: string | null;
}

export function AdminClients() {
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<PurchasedRow[]>([]);
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);
  const [profileOptions, setProfileOptions] = useState<ProfileOption[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    user_id: "", project_id: "", unit_number: "", purchase_date: "",
    progress_percent: "0", status: "pending",
  });

  const fetchData = async () => {
    const [purchRes, projRes, profRes] = await Promise.all([
      supabase.from("purchased_properties").select("*, projects(name)").order("created_at", { ascending: false }),
      supabase.from("projects").select("id, name"),
      supabase.from("profiles").select("user_id, full_name"),
    ]);
    if (purchRes.data) setPurchases(purchRes.data as any);
    if (projRes.data) setProjectOptions(projRes.data);
    if (profRes.data) setProfileOptions(profRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    const payload = {
      user_id: form.user_id,
      project_id: form.project_id,
      unit_number: form.unit_number || null,
      purchase_date: form.purchase_date || null,
      progress_percent: parseInt(form.progress_percent) || 0,
      status: form.status,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("purchased_properties").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("purchased_properties").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editId ? "Updated" : "Client property assigned" });
      setOpen(false);
      setEditId(null);
      setForm({ user_id: "", project_id: "", unit_number: "", purchase_date: "", progress_percent: "0", status: "pending" });
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("purchased_properties").delete().eq("id", id);
    fetchData();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Client Properties ({purchases.length})</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditId(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground"><Plus className="me-2 h-4 w-4" /> Assign Property</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit Assignment" : "Assign Property to Client"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Client</Label>
                <Select value={form.user_id} onValueChange={v => setForm({...form, user_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {profileOptions.map(p => (
                      <SelectItem key={p.user_id} value={p.user_id}>{p.full_name || p.user_id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Project</Label>
                <Select value={form.project_id} onValueChange={v => setForm({...form, project_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projectOptions.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Unit Number</Label><Input value={form.unit_number} onChange={e => setForm({...form, unit_number: e.target.value})} /></div>
                <div><Label>Purchase Date</Label><Input type="date" value={form.purchase_date} onChange={e => setForm({...form, purchase_date: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Progress %</Label><Input type="number" min="0" max="100" value={form.progress_percent} onChange={e => setForm({...form, progress_percent: e.target.value})} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSave} className="bg-accent text-accent-foreground">{editId ? "Update" : "Assign"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {purchases.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-semibold">{profileOptions.find(pr => pr.user_id === p.user_id)?.full_name || "Unknown"}</p>
                <Badge variant="outline">{p.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{p.projects?.name} {p.unit_number && `• Unité ${p.unit_number}`}</p>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={p.progress_percent || 0} className="max-w-xs h-2" />
                <span className="text-xs text-accent font-medium">{p.progress_percent || 0}%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => { setForm({ user_id: p.user_id, project_id: p.project_id, unit_number: p.unit_number || "", purchase_date: p.purchase_date || "", progress_percent: String(p.progress_percent || 0), status: p.status || "pending" }); setEditId(p.id); setOpen(true); }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {purchases.length === 0 && <p className="text-center text-muted-foreground py-8">No client properties assigned yet.</p>}
      </div>
    </div>
  );
}
