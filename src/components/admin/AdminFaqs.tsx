import { useCallback, useEffect, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface FaqRow {
  id: string;
  page: "projects" | "contact";
  question_en: string;
  question_fr: string | null;
  question_ar: string | null;
  answer_en: string;
  answer_fr: string | null;
  answer_ar: string | null;
  sort_order: number;
  is_active: boolean;
}

const emptyForm = {
  page: "projects",
  question_en: "",
  question_fr: "",
  question_ar: "",
  answer_en: "",
  answer_fr: "",
  answer_ar: "",
  sort_order: "0",
  is_active: "true",
};

export function AdminFaqs() {
  const { toast } = useToast();
  const { isSecretary, isSuperAdmin } = useAuth();
  const [faqs, setFaqs] = useState<FaqRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const canDelete = !isSecretary || isSuperAdmin;

  const fetchFaqs = useCallback(async () => {
    const { data, error } = await supabase
      .from("site_faqs")
      .select("*")
      .order("page", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setFaqs((data as FaqRow[]) || []);
  }, [toast]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleSave = async () => {
    const payload = {
      page: form.page as "projects" | "contact",
      question_en: form.question_en.trim(),
      question_fr: form.question_fr.trim() || null,
      question_ar: form.question_ar.trim() || null,
      answer_en: form.answer_en.trim(),
      answer_fr: form.answer_fr.trim() || null,
      answer_ar: form.answer_ar.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active === "true",
    };

    if (!payload.question_en || !payload.answer_en) {
      toast({ title: "Error", description: "English question and answer are required.", variant: "destructive" });
      return;
    }

    let error;
    if (editId) {
      ({ error } = await supabase.from("site_faqs").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("site_faqs").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editId ? "FAQ updated" : "FAQ created" });
    setOpen(false);
    setForm(emptyForm);
    setEditId(null);
    fetchFaqs();
  };

  const handleEdit = (faq: FaqRow) => {
    setForm({
      page: faq.page,
      question_en: faq.question_en,
      question_fr: faq.question_fr || "",
      question_ar: faq.question_ar || "",
      answer_en: faq.answer_en,
      answer_fr: faq.answer_fr || "",
      answer_ar: faq.answer_ar || "",
      sort_order: String(faq.sort_order),
      is_active: faq.is_active ? "true" : "false",
    });
    setEditId(faq.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("site_faqs").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    fetchFaqs();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">FAQ Management ({faqs.length})</h2>
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
            <Button className="bg-accent text-accent-foreground"><Plus className="me-2 h-4 w-4" /> Add FAQ</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit FAQ" : "New FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label>Page</Label>
                  <Select value={form.page} onValueChange={(value) => setForm({ ...form, page: value as "projects" | "contact" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="projects">Projects</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sort order</Label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.is_active} onValueChange={(value) => setForm({ ...form, is_active: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div><Label>Question (EN)</Label><Input value={form.question_en} onChange={(e) => setForm({ ...form, question_en: e.target.value })} /></div>
              <div><Label>Question (FR)</Label><Input value={form.question_fr} onChange={(e) => setForm({ ...form, question_fr: e.target.value })} /></div>
              <div><Label>Question (AR)</Label><Input value={form.question_ar} onChange={(e) => setForm({ ...form, question_ar: e.target.value })} dir="rtl" /></div>

              <div><Label>Answer (EN)</Label><Textarea rows={3} value={form.answer_en} onChange={(e) => setForm({ ...form, answer_en: e.target.value })} /></div>
              <div><Label>Answer (FR)</Label><Textarea rows={3} value={form.answer_fr} onChange={(e) => setForm({ ...form, answer_fr: e.target.value })} /></div>
              <div><Label>Answer (AR)</Label><Textarea rows={3} value={form.answer_ar} onChange={(e) => setForm({ ...form, answer_ar: e.target.value })} dir="rtl" /></div>

              <Button onClick={handleSave} className="bg-accent text-accent-foreground">{editId ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{faq.question_en}</p>
                <Badge variant="outline">{faq.page}</Badge>
                {!faq.is_active && <Badge variant="secondary">Hidden</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{faq.answer_en}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}><Pencil className="h-4 w-4" /></Button>
              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The FAQ entry will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(faq.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="py-8 text-center text-muted-foreground">No FAQ entries yet.</p>}
      </div>
    </div>
  );
}
