import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, Star, MessageSquare } from "lucide-react";

interface ReviewRow {
  id: string;
  reviewer_name: string;
  reviewer_role_en: string | null;
  reviewer_role_fr: string | null;
  reviewer_role_ar: string | null;
  text_en: string;
  text_fr: string | null;
  text_ar: string | null;
  rating: number | null;
  is_approved: boolean | null;
  created_at: string;
}

const emptyForm = {
  reviewer_name: "",
  reviewer_role_en: "",
  reviewer_role_fr: "",
  reviewer_role_ar: "",
  text_en: "",
  text_fr: "",
  text_ar: "",
  rating: "5",
  is_approved: true,
};

export function AdminReviews() {
  const { toast } = useToast();
  const { isSecretary, isSuperAdmin } = useAuth();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const cannotManageReviews = isSecretary && !isSuperAdmin;

  const fetchReviews = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setReviews(data as ReviewRow[]);
  }, []);

  useEffect(() => {
    if (cannotManageReviews) return;
    fetchReviews();
  }, [cannotManageReviews, fetchReviews]);

  if (cannotManageReviews) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Reviews management is available for admin and super admin only.
      </div>
    );
  }

  const handleSave = async () => {
    if (!form.reviewer_name || !form.text_en) {
      toast({ title: "Error", description: "Reviewer name and English text are required.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("reviews").insert({
      reviewer_name: form.reviewer_name,
      reviewer_role_en: form.reviewer_role_en || null,
      reviewer_role_fr: form.reviewer_role_fr || null,
      reviewer_role_ar: form.reviewer_role_ar || null,
      text_en: form.text_en,
      text_fr: form.text_fr || null,
      text_ar: form.text_ar || null,
      rating: parseInt(form.rating) || 5,
      is_approved: form.is_approved,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review added!" });
      setOpen(false);
      setForm(emptyForm);
      fetchReviews();
    }
  };

  const toggleApproval = async (id: string, current: boolean) => {
    await supabase.from("reviews").update({ is_approved: !current }).eq("id", id);
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("reviews").delete().eq("id", id);
    fetchReviews();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          Client Reviews ({reviews.length})
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground">
              <Plus className="me-2 h-4 w-4" /> Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Client Review</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reviewer Name *</Label>
                  <Input value={form.reviewer_name} onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label>Rating (1–5)</Label>
                  <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="mt-1.5" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Role (EN)</Label>
                  <Input value={form.reviewer_role_en} onChange={(e) => setForm({ ...form, reviewer_role_en: e.target.value })} placeholder="Property Owner" className="mt-1.5" />
                </div>
                <div>
                  <Label>Role (FR)</Label>
                  <Input value={form.reviewer_role_fr} onChange={(e) => setForm({ ...form, reviewer_role_fr: e.target.value })} placeholder="Propriétaire" className="mt-1.5" />
                </div>
                <div>
                  <Label>Role (AR)</Label>
                  <Input value={form.reviewer_role_ar} onChange={(e) => setForm({ ...form, reviewer_role_ar: e.target.value })} placeholder="مالك عقار" className="mt-1.5" dir="rtl" />
                </div>
              </div>
              <div>
                <Label>Review Text (EN) *</Label>
                <Textarea value={form.text_en} onChange={(e) => setForm({ ...form, text_en: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Review Text (FR)</Label>
                <Textarea value={form.text_fr} onChange={(e) => setForm({ ...form, text_fr: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Review Text (AR)</Label>
                <Textarea value={form.text_ar} onChange={(e) => setForm({ ...form, text_ar: e.target.value })} dir="rtl" className="mt-1.5" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_approved}
                  onCheckedChange={(v) => setForm({ ...form, is_approved: v })}
                />
                <Label>Published (visible to public)</Label>
              </div>
              <Button onClick={handleSave} className="bg-accent text-accent-foreground">Add Review</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{r.reviewer_name}</span>
                  <span className="text-sm text-muted-foreground">{r.reviewer_role_en}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                    ))}
                  </div>
                  <Badge variant={r.is_approved ? "default" : "secondary"} className="text-xs">
                    {r.is_approved ? "Published" : "Hidden"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">"{r.text_en}"</p>
                {r.text_fr && <p className="mt-1 text-xs text-muted-foreground/70 line-clamp-1">FR: "{r.text_fr}"</p>}
                {r.text_ar && <p className="mt-1 text-xs text-muted-foreground/70 line-clamp-1 text-right" dir="rtl">AR: "{r.text_ar}"</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={r.is_approved ?? false}
                  onCheckedChange={() => toggleApproval(r.id, r.is_approved ?? false)}
                  title="Toggle visibility"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete review?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This review will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(r.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No reviews yet. Add some to showcase on the homepage!</p>
        )}
      </div>
    </div>
  );
}
