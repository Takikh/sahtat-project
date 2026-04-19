import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";

type ProjectOption = {
  id: string;
  name: string;
};

type UnitTypeRow = {
  id: string;
  project_id: string;
  type_code: string;
  label_en: string | null;
  label_fr: string | null;
  label_ar: string | null;
  area_min_m2: number | null;
  area_max_m2: number | null;
  starting_price_dzd: number | null;
  status: "available" | "limited" | "sold_out";
  plan_url: string | null;
  sort_order: number;
  projects: { name: string } | { name: string }[] | null;
};

const emptyForm = {
  project_id: "",
  type_code: "",
  label_en: "",
  label_fr: "",
  label_ar: "",
  area_min_m2: "",
  area_max_m2: "",
  starting_price_dzd: "",
  status: "available",
  plan_url: "",
  sort_order: "0",
};

const toNullableNumber = (value: string) => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const relationProjectName = (projects: UnitTypeRow["projects"]) => {
  if (!projects) return "Unknown project";
  return Array.isArray(projects) ? (projects[0]?.name || "Unknown project") : projects.name;
};

export function AdminUnitTypes() {
  const { toast } = useToast();
  const [rows, setRows] = useState<UnitTypeRow[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = useCallback(async () => {
    const [unitRes, projectRes] = await Promise.all([
      supabase
        .from("project_unit_types")
        .select("*, projects(name)")
        .order("created_at", { ascending: false }),
      supabase.from("projects").select("id, name").order("name", { ascending: true }),
    ]);

    if (unitRes.error) {
      toast({ title: "Error", description: unitRes.error.message, variant: "destructive" });
      setRows([]);
    } else {
      setRows((unitRes.data as UnitTypeRow[]) || []);
    }

    if (projectRes.error) {
      toast({ title: "Error", description: projectRes.error.message, variant: "destructive" });
      setProjects([]);
    } else {
      setProjects((projectRes.data as ProjectOption[]) || []);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!form.project_id || !form.type_code.trim()) {
      toast({ title: "Error", description: "Project and type code are required.", variant: "destructive" });
      return;
    }

    const payload = {
      project_id: form.project_id,
      type_code: form.type_code.trim(),
      label_en: form.label_en.trim() || null,
      label_fr: form.label_fr.trim() || null,
      label_ar: form.label_ar.trim() || null,
      area_min_m2: toNullableNumber(form.area_min_m2),
      area_max_m2: toNullableNumber(form.area_max_m2),
      starting_price_dzd: toNullableNumber(form.starting_price_dzd),
      status: form.status,
      plan_url: form.plan_url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("project_unit_types").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("project_unit_types").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editId ? "Unit type updated" : "Unit type created" });
    setOpen(false);
    setEditId(null);
    setForm(emptyForm);
    fetchData();
  };

  const handleEdit = (row: UnitTypeRow) => {
    setForm({
      project_id: row.project_id,
      type_code: row.type_code,
      label_en: row.label_en || "",
      label_fr: row.label_fr || "",
      label_ar: row.label_ar || "",
      area_min_m2: row.area_min_m2?.toString() || "",
      area_max_m2: row.area_max_m2?.toString() || "",
      starting_price_dzd: row.starting_price_dzd?.toString() || "",
      status: row.status,
      plan_url: row.plan_url || "",
      sort_order: row.sort_order.toString(),
    });
    setEditId(row.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("project_unit_types").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    fetchData();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-accent" />
          Apartment Types ({rows.length})
        </h2>

        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) {
              setForm(emptyForm);
              setEditId(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground">
              <Plus className="me-2 h-4 w-4" /> Add Unit Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Unit Type" : "New Unit Type"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label>Project *</Label>
                <Select value={form.project_id} onValueChange={(value) => setForm({ ...form, project_id: value })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Type code *</Label>
                  <Input value={form.type_code} onChange={(e) => setForm({ ...form, type_code: e.target.value })} placeholder="F2, F3, Duplex..." className="mt-1.5" />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">available</SelectItem>
                      <SelectItem value="limited">limited</SelectItem>
                      <SelectItem value="sold_out">sold_out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div><Label>Label EN</Label><Input value={form.label_en} onChange={(e) => setForm({ ...form, label_en: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Label FR</Label><Input value={form.label_fr} onChange={(e) => setForm({ ...form, label_fr: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Label AR</Label><Input value={form.label_ar} onChange={(e) => setForm({ ...form, label_ar: e.target.value })} className="mt-1.5" dir="rtl" /></div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div><Label>Area min (m2)</Label><Input type="number" min={0} value={form.area_min_m2} onChange={(e) => setForm({ ...form, area_min_m2: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Area max (m2)</Label><Input type="number" min={0} value={form.area_max_m2} onChange={(e) => setForm({ ...form, area_max_m2: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Starting price (DZD)</Label><Input type="number" min={0} value={form.starting_price_dzd} onChange={(e) => setForm({ ...form, starting_price_dzd: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="mt-1.5" /></div>
              </div>

              <div>
                <Label>Plan URL</Label>
                <Input value={form.plan_url} onChange={(e) => setForm({ ...form, plan_url: e.target.value })} className="mt-1.5" placeholder="https://... or /docs/..." />
              </div>

              <Button onClick={handleSave} className="bg-accent text-accent-foreground">{editId ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{row.label_en || row.type_code}</p>
                <Badge variant="outline">{row.type_code}</Badge>
                <Badge className={row.status === "sold_out" ? "bg-destructive/10 text-destructive" : row.status === "limited" ? "bg-amber-500/10 text-amber-600" : "bg-green-500/10 text-green-600"}>
                  {row.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{relationProjectName(row.projects)}</p>
              <p className="text-xs text-muted-foreground">
                {row.area_min_m2 !== null || row.area_max_m2 !== null ? `${row.area_min_m2 || "?"} - ${row.area_max_m2 || "?"} m2` : "Area n/a"}
                {row.starting_price_dzd !== null ? ` • from ${row.starting_price_dzd.toLocaleString()} DZD` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}><Pencil className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete unit type?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This unit type will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(row.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No apartment types yet.</p>
        )}
      </div>
    </div>
  );
}
