import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";

interface NewsRow {
  id: string;
  slug: string;
  title_en: string;
  title_fr: string | null;
  title_ar: string | null;
  excerpt_en: string | null;
  content_en: string | null;
  content_fr: string | null;
  content_ar: string | null;
  image_url: string | null;
  published_at: string;
}

const emptyForm = {
  slug: "", title_en: "", title_fr: "", title_ar: "",
  excerpt_en: "", content_en: "", content_fr: "", content_ar: "",
  image_url: "", published_at: new Date().toISOString().split("T")[0],
};

export function AdminNews() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<NewsRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchNews = async () => {
    const { data } = await supabase.from("news_articles").select("*").order("published_at", { ascending: false });
    if (data) setArticles(data as NewsRow[]);
  };

  useEffect(() => { fetchNews(); }, []);

  const handleSave = async () => {
    const payload = {
      slug: form.slug || form.title_en.toLowerCase().replace(/\s+/g, "-"),
      title_en: form.title_en,
      title_fr: form.title_fr || null,
      title_ar: form.title_ar || null,
      excerpt_en: form.excerpt_en || null,
      content_en: form.content_en || null,
      content_fr: form.content_fr || null,
      content_ar: form.content_ar || null,
      image_url: form.image_url || null,
      published_at: form.published_at,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("news_articles").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("news_articles").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editId ? "Article updated" : "Article created" });
      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
      fetchNews();
    }
  };

  const handleEdit = (a: NewsRow) => {
    setForm({
      slug: a.slug, title_en: a.title_en, title_fr: a.title_fr || "",
      title_ar: a.title_ar || "", excerpt_en: a.excerpt_en || "",
      content_en: a.content_en || "", content_fr: a.content_fr || "",
      content_ar: a.content_ar || "", image_url: a.image_url || "",
      published_at: a.published_at,
    });
    setEditId(a.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("news_articles").delete().eq("id", id);
    fetchNews();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">News Articles ({articles.length})</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm(emptyForm); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground"><Plus className="me-2 h-4 w-4" /> Add Article</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader><DialogTitle>{editId ? "Edit Article" : "New Article"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Title (EN)</Label><Input value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} /></div>
                <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="auto" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Title (FR)</Label><Input value={form.title_fr} onChange={e => setForm({...form, title_fr: e.target.value})} /></div>
                <div><Label>Title (AR)</Label><Input value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} dir="rtl" /></div>
              </div>
              <div><Label>Excerpt (EN)</Label><Textarea value={form.excerpt_en} onChange={e => setForm({...form, excerpt_en: e.target.value})} rows={2} /></div>
              <div><Label>Content (EN)</Label><Textarea value={form.content_en} onChange={e => setForm({...form, content_en: e.target.value})} rows={4} /></div>
              <div><Label>Content (FR)</Label><Textarea value={form.content_fr} onChange={e => setForm({...form, content_fr: e.target.value})} rows={4} /></div>
              <div><Label>Content (AR)</Label><Textarea value={form.content_ar} onChange={e => setForm({...form, content_ar: e.target.value})} rows={4} dir="rtl" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
                <div><Label>Published Date</Label><Input type="date" value={form.published_at} onChange={e => setForm({...form, published_at: e.target.value})} /></div>
              </div>
              <Button onClick={handleSave} className="bg-accent text-accent-foreground">{editId ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <p className="font-semibold">{a.title_en}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-3 w-3" />{a.published_at}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(a)}><Pencil className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete article?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The article will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(a.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {articles.length === 0 && <p className="text-center text-muted-foreground py-8">No articles yet.</p>}
      </div>
    </div>
  );
}
