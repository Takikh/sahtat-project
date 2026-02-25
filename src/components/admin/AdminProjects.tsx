import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";

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
  features: string[];
  location: string | null;
}

const emptyForm = {
  name: "", slug: "", city: "", type: "apartment", status: "upcoming",
  image_url: "", description_en: "", description_fr: "", description_ar: "",
  features: "", location: "",
};

export function AdminProjects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Failed to load projects", description: error.message, variant: "destructive" });
      setProjects([]);
      setLoading(false);
      return;
    }

    setProjects((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file", description: "Please upload JPG, PNG, or WEBP.", variant: "destructive" });
      return;
    }

    setUploadingImage(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `projects/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setUploadingImage(false);
      toast({
        title: "Upload failed",
        description: `${uploadError.message}. Make sure bucket 'project-images' exists and is public.`,
        variant: "destructive",
      });
      return;
    }

    const { data } = supabase.storage.from("project-images").getPublicUrl(filePath);

    setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    setUploadingImage(false);
    toast({ title: "Image uploaded", description: "Image URL has been filled automatically." });
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      city: form.city,
      type: form.type,
      status: form.status,
      image_url: form.image_url || null,
      description_en: form.description_en || null,
      description_fr: form.description_fr || null,
      description_ar: form.description_ar || null,
      features: form.features ? form.features.split(",").map(f => f.trim()) : [],
      location: form.location || null,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("projects").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("projects").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editId ? "Project updated" : "Project created" });
      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
      fetchProjects();
    }
  };

  const handleEdit = (p: ProjectRow) => {
    setForm({
      name: p.name, slug: p.slug, city: p.city, type: p.type, status: p.status,
      image_url: p.image_url || "", description_en: p.description_en || "",
      description_fr: p.description_fr || "", description_ar: p.description_ar || "",
      features: Array.isArray(p.features) ? p.features.join(", ") : "",
      location: p.location || "",
    });
    setEditId(p.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchProjects();
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Projects ({projects.length})</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm(emptyForm); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground"><Plus className="me-2 h-4 w-4" /> Add Project</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="auto-generated" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>City</Label><Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
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
                  <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="inProgress">In Progress</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
                <div className="flex flex-wrap items-center gap-3">
                  <Label
                    htmlFor="project-image-upload"
                    className="inline-flex cursor-pointer items-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent/10"
                  >
                    {uploadingImage ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Upload className="me-2 h-4 w-4" />}
                    {uploadingImage ? "Uploading..." : "Upload from computer"}
                  </Label>
                  <Input
                    id="project-image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                    disabled={uploadingImage}
                  />
                  <p className="text-xs text-muted-foreground">Bucket: project-images</p>
                </div>
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="h-32 w-full rounded-md object-cover border border-border" />
                )}
              </div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
              <div><Label>Features (comma separated)</Label><Input value={form.features} onChange={e => setForm({...form, features: e.target.value})} /></div>
              <div><Label>Description (EN)</Label><Textarea value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} /></div>
              <div><Label>Description (FR)</Label><Textarea value={form.description_fr} onChange={e => setForm({...form, description_fr: e.target.value})} /></div>
              <div><Label>Description (AR)</Label><Textarea value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} dir="rtl" /></div>
              <Button onClick={handleSave} className="bg-accent text-accent-foreground">{editId ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-center text-muted-foreground py-8">Loading projects...</p>}
        {projects.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-4">
              {p.image_url && <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded-md object-cover" />}
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.city} • {p.type}</p>
              </div>
              <Badge variant="outline">{p.status}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {!loading && projects.length === 0 && <p className="text-center text-muted-foreground py-8">No projects yet.</p>}
      </div>
    </div>
  );
}
