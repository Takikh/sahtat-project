import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ImageIcon, ChevronDown, ChevronUp, Construction } from "lucide-react";

interface PropertyRow {
  id: string;
  user_id: string;
  unit_number: string | null;
  progress_percent: number | null;
  status: string | null;
  projects: { name: string } | null;
  profiles: { full_name: string | null } | null;
}

interface ProgressRow {
  id: string;
  purchased_property_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  progress_percent: number | null;
  update_date: string;
}

// Real progress images available
const progressImages = [
  "/images/progress/591829073_2948645382190409_2021694690705268262_n.jpg",
  "/images/progress/591836054_2948645458857068_2912251261253597060_n.jpg",
  "/images/progress/591874639_2948645575523723_2147101144163856009_n.jpg",
  "/images/progress/591919291_2948645252190422_2008907025086942410_n.jpg",
  "/images/progress/591939530_2948645335523747_1749020065561663697_n.jpg",
  "/images/progress/593434867_2948645422190405_7054678247068316215_n.jpg",
  "/images/progress/593518319_2948645292190418_2697727548548585938_n.jpg",
  "/images/progress/593619765_2948645492190398_2575652475131437816_n.jpg",
  "/images/progress/594963203_2948645535523727_5497314603072907544_n.jpg",
];

export function AdminProgressUpdates() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [updates, setUpdates] = useState<Record<string, ProgressRow[]>>({});
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    progress_percent: "0",
    update_date: new Date().toISOString().split("T")[0],
  });
  const [useBuiltInImage, setUseBuiltInImage] = useState(false);

  const fetchData = async () => {
    const propRes = await supabase
      .from("purchased_properties")
      .select("id, user_id, unit_number, progress_percent, status, projects(name), profiles(full_name)")
      .order("created_at", { ascending: false });

    if (propRes.data) {
      const propertyRows = propRes.data as unknown as PropertyRow[];
      setProperties(propertyRows);
      // Fetch all progress updates
      const progressMap: Record<string, ProgressRow[]> = {};
      await Promise.all(
        propertyRows.map(async (p) => {
          const { data } = await supabase
            .from("construction_progress")
            .select("*")
            .eq("purchased_property_id", p.id)
            .order("update_date", { ascending: false });
          progressMap[p.id] = (data as ProgressRow[]) || [];
        })
      );
      setUpdates(progressMap);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddUpdate = async () => {
    if (!selectedPropertyId || !form.title) {
      toast({ title: "Error", description: "Property and title are required.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("construction_progress").insert({
      purchased_property_id: selectedPropertyId,
      title: form.title,
      description: form.description || null,
      image_url: form.image_url || null,
      progress_percent: parseInt(form.progress_percent) || 0,
      update_date: form.update_date,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Also update the overall progress on the property
      await supabase
        .from("purchased_properties")
        .update({ progress_percent: parseInt(form.progress_percent) || 0 })
        .eq("id", selectedPropertyId);

      toast({ title: "Progress update added!" });
      setOpen(false);
      setForm({ title: "", description: "", image_url: "", progress_percent: "0", update_date: new Date().toISOString().split("T")[0] });
      fetchData();
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    await supabase.from("construction_progress").delete().eq("id", updateId);
    fetchData();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <Construction className="h-5 w-5 text-accent" />
          Construction Progress ({properties.length} properties)
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground">
              <Plus className="me-2 h-4 w-4" /> Add Progress Update
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Construction Progress Update</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Property *</Label>
                <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.profiles?.full_name || "Client"} – {p.projects?.name}
                        {p.unit_number && ` (Unit ${p.unit_number})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Update Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Foundation complete / Gros œuvre terminé"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Details about this update..."
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Progress % *</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={form.progress_percent}
                    onChange={(e) => setForm({ ...form, progress_percent: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Update Date</Label>
                  <Input
                    type="date"
                    value={form.update_date}
                    onChange={(e) => setForm({ ...form, update_date: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Image</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUseBuiltInImage(!useBuiltInImage)}
                  >
                    <ImageIcon className="me-1 h-3 w-3" />
                    {useBuiltInImage ? "Enter URL" : "Use built-in image"}
                  </Button>
                </div>
                {useBuiltInImage ? (
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {progressImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setForm({ ...form, image_url: img })}
                        className={`relative overflow-hidden rounded-md border-2 transition-all ${
                          form.image_url === img ? "border-accent" : "border-border"
                        }`}
                      >
                        <img src={img} alt={`Progress ${i + 1}`} className="aspect-square w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://... or /images/progress/..."
                    className="mt-1.5"
                  />
                )}
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-md" />
                )}
              </div>

              <Button onClick={handleAddUpdate} className="bg-accent text-accent-foreground">
                Add Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {properties.map((p) => {
          const propUpdates = updates[p.id] || [];
          const isExpanded = expandedProperty === p.id;

          return (
            <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-accent/5 transition-colors text-left"
                onClick={() => setExpandedProperty(isExpanded ? null : p.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{p.profiles?.full_name || "Client"}</span>
                    <Badge variant="outline" className="text-xs">{p.status}</Badge>
                    {propUpdates.length > 0 && (
                      <Badge className="bg-accent/10 text-accent text-xs">{propUpdates.length} updates</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {p.projects?.name}{p.unit_number && ` • Unit ${p.unit_number}`}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={p.progress_percent || 0} className="h-2 max-w-xs" />
                    <span className="text-xs font-medium text-accent">{p.progress_percent || 0}%</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {isExpanded && (
                <div className="border-t border-border p-4">
                  {propUpdates.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No updates yet for this property.</p>
                  ) : (
                    <div className="space-y-3">
                      {propUpdates.map((update) => (
                        <div key={update.id} className="flex gap-3 rounded-lg border border-border bg-background p-3">
                          {update.image_url && (
                            <img
                              src={update.image_url}
                              alt={update.title}
                              className="h-20 w-20 shrink-0 rounded-md object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-sm">{update.title}</p>
                                {update.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{update.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-accent font-medium">{update.progress_percent}%</span>
                                  <span className="text-xs text-muted-foreground">{update.update_date}</span>
                                </div>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7">
                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete progress update?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This progress entry will be permanently removed.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUpdate(update.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {properties.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No client properties found.</p>
        )}
      </div>
    </div>
  );
}
