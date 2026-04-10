import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toStringArray, toTimeline } from "@/lib/projectContent";

interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  city: string;
  type: string;
  status: string;
  image_url: string | null;
  description_en: string | null;
  description_fr: string | null;
  description_ar: string | null;
  features: unknown;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  price_min_dzd: number | null;
  price_max_dzd: number | null;
  area_min_m2: number | null;
  area_max_m2: number | null;
  total_units: number | null;
  units_left: number | null;
  delivery_date: string | null;
  payment_plan_en: string | null;
  payment_plan_fr: string | null;
  payment_plan_ar: string | null;
  what_en: string | null;
  what_fr: string | null;
  what_ar: string | null;
  for_whom_en: string | null;
  for_whom_fr: string | null;
  for_whom_ar: string | null;
  why_now_en: string | null;
  why_now_fr: string | null;
  why_now_ar: string | null;
  included_en: string | null;
  included_fr: string | null;
  included_ar: string | null;
  guarantee_en: string | null;
  guarantee_fr: string | null;
  guarantee_ar: string | null;
  gallery_urls: unknown;
  floor_plan_urls: unknown;
  short_video_url: string | null;
  construction_timeline: unknown;
  seo_title_en: string | null;
  seo_title_fr: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_fr: string | null;
  seo_description_ar: string | null;
}

const emptyForm = {
  name: "",
  slug: "",
  city: "",
  type: "apartment",
  status: "upcoming",
  image_url: "",
  location: "",
  latitude: "",
  longitude: "",
  price_min_dzd: "",
  price_max_dzd: "",
  area_min_m2: "",
  area_max_m2: "",
  total_units: "",
  units_left: "",
  delivery_date: "",
  features: "",
  gallery_urls: "",
  floor_plan_urls: "",
  short_video_url: "",
  timeline_lines: "",
  description_en: "",
  description_fr: "",
  description_ar: "",
  what_en: "",
  what_fr: "",
  what_ar: "",
  for_whom_en: "",
  for_whom_fr: "",
  for_whom_ar: "",
  why_now_en: "",
  why_now_fr: "",
  why_now_ar: "",
  included_en: "",
  included_fr: "",
  included_ar: "",
  guarantee_en: "",
  guarantee_fr: "",
  guarantee_ar: "",
  payment_plan_en: "",
  payment_plan_fr: "",
  payment_plan_ar: "",
  seo_title_en: "",
  seo_title_fr: "",
  seo_title_ar: "",
  seo_description_en: "",
  seo_description_fr: "",
  seo_description_ar: "",
};

const toNullableNumber = (value: string) => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseCsvOrLines = (raw: string) =>
  raw
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const parseTimelineLines = (raw: string) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [date, status, progress, titleEn, titleFr, titleAr] = line.split("|").map((part) => part.trim());
      const entry: Record<string, string | number> = { date };

      if (status) entry.status = status;
      if (progress && Number.isFinite(Number(progress))) entry.progress = Number(progress);
      if (titleEn) entry.title_en = titleEn;
      if (titleFr) entry.title_fr = titleFr;
      if (titleAr) entry.title_ar = titleAr;

      return entry;
    })
    .filter((entry) => entry.date && (entry.title_en || entry.title_fr || entry.title_ar));

const timelineToEditorText = (timeline: unknown) =>
  toTimeline(timeline as never)
    .map((entry) => {
      const values = [
        entry.date,
        entry.status || "",
        entry.progress !== undefined ? String(entry.progress) : "",
        entry.title_en || "",
        entry.title_fr || "",
        entry.title_ar || "",
      ];
      return values.join("|");
    })
    .join("\n");

export function AdminProjects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data as ProjectRow[]);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async () => {
    const payload = {
      name: form.name.trim(),
      slug: (form.slug || form.name).toLowerCase().replace(/\s+/g, "-").trim(),
      city: form.city.trim(),
      type: form.type,
      status: form.status,
      image_url: form.image_url.trim() || null,
      location: form.location.trim() || null,
      latitude: toNullableNumber(form.latitude),
      longitude: toNullableNumber(form.longitude),
      price_min_dzd: toNullableNumber(form.price_min_dzd),
      price_max_dzd: toNullableNumber(form.price_max_dzd),
      area_min_m2: toNullableNumber(form.area_min_m2),
      area_max_m2: toNullableNumber(form.area_max_m2),
      total_units: toNullableNumber(form.total_units),
      units_left: toNullableNumber(form.units_left),
      delivery_date: form.delivery_date || null,
      features: parseCsvOrLines(form.features),
      gallery_urls: parseCsvOrLines(form.gallery_urls),
      floor_plan_urls: parseCsvOrLines(form.floor_plan_urls),
      short_video_url: form.short_video_url.trim() || null,
      construction_timeline: parseTimelineLines(form.timeline_lines),
      description_en: form.description_en.trim() || null,
      description_fr: form.description_fr.trim() || null,
      description_ar: form.description_ar.trim() || null,
      what_en: form.what_en.trim() || null,
      what_fr: form.what_fr.trim() || null,
      what_ar: form.what_ar.trim() || null,
      for_whom_en: form.for_whom_en.trim() || null,
      for_whom_fr: form.for_whom_fr.trim() || null,
      for_whom_ar: form.for_whom_ar.trim() || null,
      why_now_en: form.why_now_en.trim() || null,
      why_now_fr: form.why_now_fr.trim() || null,
      why_now_ar: form.why_now_ar.trim() || null,
      included_en: form.included_en.trim() || null,
      included_fr: form.included_fr.trim() || null,
      included_ar: form.included_ar.trim() || null,
      guarantee_en: form.guarantee_en.trim() || null,
      guarantee_fr: form.guarantee_fr.trim() || null,
      guarantee_ar: form.guarantee_ar.trim() || null,
      payment_plan_en: form.payment_plan_en.trim() || null,
      payment_plan_fr: form.payment_plan_fr.trim() || null,
      payment_plan_ar: form.payment_plan_ar.trim() || null,
      seo_title_en: form.seo_title_en.trim() || null,
      seo_title_fr: form.seo_title_fr.trim() || null,
      seo_title_ar: form.seo_title_ar.trim() || null,
      seo_description_en: form.seo_description_en.trim() || null,
      seo_description_fr: form.seo_description_fr.trim() || null,
      seo_description_ar: form.seo_description_ar.trim() || null,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("projects").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("projects").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editId ? "Project updated" : "Project created" });
    setOpen(false);
    setForm(emptyForm);
    setEditId(null);
    fetchProjects();
  };

  const handleEdit = (project: ProjectRow) => {
    setForm({
      name: project.name,
      slug: project.slug,
      city: project.city,
      type: project.type,
      status: project.status,
      image_url: project.image_url || "",
      location: project.location || "",
      latitude: project.latitude?.toString() || "",
      longitude: project.longitude?.toString() || "",
      price_min_dzd: project.price_min_dzd?.toString() || "",
      price_max_dzd: project.price_max_dzd?.toString() || "",
      area_min_m2: project.area_min_m2?.toString() || "",
      area_max_m2: project.area_max_m2?.toString() || "",
      total_units: project.total_units?.toString() || "",
      units_left: project.units_left?.toString() || "",
      delivery_date: project.delivery_date || "",
      features: toStringArray(project.features as never).join("\n"),
      gallery_urls: toStringArray(project.gallery_urls as never).join("\n"),
      floor_plan_urls: toStringArray(project.floor_plan_urls as never).join("\n"),
      short_video_url: project.short_video_url || "",
      timeline_lines: timelineToEditorText(project.construction_timeline),
      description_en: project.description_en || "",
      description_fr: project.description_fr || "",
      description_ar: project.description_ar || "",
      what_en: project.what_en || "",
      what_fr: project.what_fr || "",
      what_ar: project.what_ar || "",
      for_whom_en: project.for_whom_en || "",
      for_whom_fr: project.for_whom_fr || "",
      for_whom_ar: project.for_whom_ar || "",
      why_now_en: project.why_now_en || "",
      why_now_fr: project.why_now_fr || "",
      why_now_ar: project.why_now_ar || "",
      included_en: project.included_en || "",
      included_fr: project.included_fr || "",
      included_ar: project.included_ar || "",
      guarantee_en: project.guarantee_en || "",
      guarantee_fr: project.guarantee_fr || "",
      guarantee_ar: project.guarantee_ar || "",
      payment_plan_en: project.payment_plan_en || "",
      payment_plan_fr: project.payment_plan_fr || "",
      payment_plan_ar: project.payment_plan_ar || "",
      seo_title_en: project.seo_title_en || "",
      seo_title_fr: project.seo_title_fr || "",
      seo_title_ar: project.seo_title_ar || "",
      seo_description_en: project.seo_description_en || "",
      seo_description_fr: project.seo_description_fr || "",
      seo_description_ar: project.seo_description_ar || "",
    });

    setEditId(project.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    fetchProjects();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Projects ({projects.length})</h2>
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
            <Button className="bg-accent text-accent-foreground"><Plus className="me-2 h-4 w-4" /> Add Project</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="inProgress">In Progress</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 p-4">
                <p className="mb-3 text-sm font-semibold">Core details</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div><Label>Cover image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
                  <div><Label>Location text</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                  <div><Label>Latitude</Label><Input type="number" step="0.000001" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} /></div>
                  <div><Label>Longitude</Label><Input type="number" step="0.000001" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} /></div>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 p-4">
                <p className="mb-3 text-sm font-semibold">Availability and key specs</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div><Label>Price min (DZD)</Label><Input type="number" min={0} value={form.price_min_dzd} onChange={(e) => setForm({ ...form, price_min_dzd: e.target.value })} /></div>
                  <div><Label>Price max (DZD)</Label><Input type="number" min={0} value={form.price_max_dzd} onChange={(e) => setForm({ ...form, price_max_dzd: e.target.value })} /></div>
                  <div><Label>Delivery date</Label><Input type="date" value={form.delivery_date} onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} /></div>
                  <div><Label>Area min (m2)</Label><Input type="number" min={0} value={form.area_min_m2} onChange={(e) => setForm({ ...form, area_min_m2: e.target.value })} /></div>
                  <div><Label>Area max (m2)</Label><Input type="number" min={0} value={form.area_max_m2} onChange={(e) => setForm({ ...form, area_max_m2: e.target.value })} /></div>
                  <div><Label>Total units</Label><Input type="number" min={0} value={form.total_units} onChange={(e) => setForm({ ...form, total_units: e.target.value })} /></div>
                  <div><Label>Units left</Label><Input type="number" min={0} value={form.units_left} onChange={(e) => setForm({ ...form, units_left: e.target.value })} /></div>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 p-4">
                <p className="mb-3 text-sm font-semibold">Media and assets</p>
                <div className="grid gap-4">
                  <div><Label>Gallery URLs (comma or new line)</Label><Textarea rows={3} value={form.gallery_urls} onChange={(e) => setForm({ ...form, gallery_urls: e.target.value })} /></div>
                  <div><Label>Floor plans (image/pdf URLs)</Label><Textarea rows={3} value={form.floor_plan_urls} onChange={(e) => setForm({ ...form, floor_plan_urls: e.target.value })} /></div>
                  <div><Label>Short video URL</Label><Input value={form.short_video_url} onChange={(e) => setForm({ ...form, short_video_url: e.target.value })} /></div>
                  <div><Label>Timeline lines (date|status|progress|title EN|title FR|title AR)</Label><Textarea rows={5} value={form.timeline_lines} onChange={(e) => setForm({ ...form, timeline_lines: e.target.value })} /></div>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 p-4">
                <p className="mb-3 text-sm font-semibold">Descriptions and structured copy</p>
                <div className="grid gap-4">
                  <div><Label>Features (comma or new line)</Label><Textarea rows={2} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
                  <div><Label>Description (EN)</Label><Textarea rows={2} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></div>
                  <div><Label>Description (FR)</Label><Textarea rows={2} value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} /></div>
                  <div><Label>Description (AR)</Label><Textarea rows={2} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} dir="rtl" /></div>

                  <div><Label>What (EN)</Label><Textarea rows={2} value={form.what_en} onChange={(e) => setForm({ ...form, what_en: e.target.value })} /></div>
                  <div><Label>What (FR)</Label><Textarea rows={2} value={form.what_fr} onChange={(e) => setForm({ ...form, what_fr: e.target.value })} /></div>
                  <div><Label>What (AR)</Label><Textarea rows={2} value={form.what_ar} onChange={(e) => setForm({ ...form, what_ar: e.target.value })} dir="rtl" /></div>

                  <div><Label>For whom (EN)</Label><Textarea rows={2} value={form.for_whom_en} onChange={(e) => setForm({ ...form, for_whom_en: e.target.value })} /></div>
                  <div><Label>For whom (FR)</Label><Textarea rows={2} value={form.for_whom_fr} onChange={(e) => setForm({ ...form, for_whom_fr: e.target.value })} /></div>
                  <div><Label>For whom (AR)</Label><Textarea rows={2} value={form.for_whom_ar} onChange={(e) => setForm({ ...form, for_whom_ar: e.target.value })} dir="rtl" /></div>

                  <div><Label>Why now (EN)</Label><Textarea rows={2} value={form.why_now_en} onChange={(e) => setForm({ ...form, why_now_en: e.target.value })} /></div>
                  <div><Label>Why now (FR)</Label><Textarea rows={2} value={form.why_now_fr} onChange={(e) => setForm({ ...form, why_now_fr: e.target.value })} /></div>
                  <div><Label>Why now (AR)</Label><Textarea rows={2} value={form.why_now_ar} onChange={(e) => setForm({ ...form, why_now_ar: e.target.value })} dir="rtl" /></div>

                  <div><Label>What included (EN)</Label><Textarea rows={2} value={form.included_en} onChange={(e) => setForm({ ...form, included_en: e.target.value })} /></div>
                  <div><Label>What included (FR)</Label><Textarea rows={2} value={form.included_fr} onChange={(e) => setForm({ ...form, included_fr: e.target.value })} /></div>
                  <div><Label>What included (AR)</Label><Textarea rows={2} value={form.included_ar} onChange={(e) => setForm({ ...form, included_ar: e.target.value })} dir="rtl" /></div>

                  <div><Label>Delivery guarantee (EN)</Label><Textarea rows={2} value={form.guarantee_en} onChange={(e) => setForm({ ...form, guarantee_en: e.target.value })} /></div>
                  <div><Label>Delivery guarantee (FR)</Label><Textarea rows={2} value={form.guarantee_fr} onChange={(e) => setForm({ ...form, guarantee_fr: e.target.value })} /></div>
                  <div><Label>Delivery guarantee (AR)</Label><Textarea rows={2} value={form.guarantee_ar} onChange={(e) => setForm({ ...form, guarantee_ar: e.target.value })} dir="rtl" /></div>

                  <div><Label>Payment plan (EN)</Label><Textarea rows={2} value={form.payment_plan_en} onChange={(e) => setForm({ ...form, payment_plan_en: e.target.value })} /></div>
                  <div><Label>Payment plan (FR)</Label><Textarea rows={2} value={form.payment_plan_fr} onChange={(e) => setForm({ ...form, payment_plan_fr: e.target.value })} /></div>
                  <div><Label>Payment plan (AR)</Label><Textarea rows={2} value={form.payment_plan_ar} onChange={(e) => setForm({ ...form, payment_plan_ar: e.target.value })} dir="rtl" /></div>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 p-4">
                <p className="mb-3 text-sm font-semibold">SEO metadata</p>
                <div className="grid gap-4">
                  <div><Label>SEO title (EN)</Label><Input value={form.seo_title_en} onChange={(e) => setForm({ ...form, seo_title_en: e.target.value })} /></div>
                  <div><Label>SEO title (FR)</Label><Input value={form.seo_title_fr} onChange={(e) => setForm({ ...form, seo_title_fr: e.target.value })} /></div>
                  <div><Label>SEO title (AR)</Label><Input value={form.seo_title_ar} onChange={(e) => setForm({ ...form, seo_title_ar: e.target.value })} dir="rtl" /></div>
                  <div><Label>SEO description (EN)</Label><Textarea rows={2} value={form.seo_description_en} onChange={(e) => setForm({ ...form, seo_description_en: e.target.value })} /></div>
                  <div><Label>SEO description (FR)</Label><Textarea rows={2} value={form.seo_description_fr} onChange={(e) => setForm({ ...form, seo_description_fr: e.target.value })} /></div>
                  <div><Label>SEO description (AR)</Label><Textarea rows={2} value={form.seo_description_ar} onChange={(e) => setForm({ ...form, seo_description_ar: e.target.value })} dir="rtl" /></div>
                </div>
              </div>

              <Button onClick={handleSave} className="bg-accent text-accent-foreground">{editId ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-4">
              {project.image_url && <img src={project.image_url} alt={project.name} className="h-12 w-12 rounded-md object-cover" />}
              <div>
                <p className="font-semibold">{project.name}</p>
                <p className="text-sm text-muted-foreground">
                  {project.city} • {project.type}
                  {project.delivery_date ? ` • Delivery ${project.delivery_date}` : ""}
                  {project.units_left !== null ? ` • ${project.units_left} left` : ""}
                </p>
              </div>
              <Badge variant="outline">{project.status}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}><Pencil className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The project and linked records may be removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="py-8 text-center text-muted-foreground">No projects yet.</p>}
      </div>
    </div>
  );
}
