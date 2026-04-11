import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Eye } from "lucide-react";

interface ContactRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean | null;
  submitted_at: string;
}

export function AdminContacts() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");

  const fetchContacts = useCallback(async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setContacts([]);
      return;
    }
    setContacts((data as ContactRow[]) || []);
  }, [toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    fetchContacts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    fetchContacts();
  };

  const unreadCount = contacts.filter(c => !c.is_read).length;
  const readCount = contacts.length - unreadCount;

  const normalizedQuery = search.trim().toLowerCase();
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      !normalizedQuery ||
      c.name.toLowerCase().includes(normalizedQuery) ||
      c.email.toLowerCase().includes(normalizedQuery) ||
      c.message.toLowerCase().includes(normalizedQuery) ||
      (c.phone || "").toLowerCase().includes(normalizedQuery);

    if (!matchesSearch) return false;

    if (statusFilter === "unread") return !c.is_read;
    if (statusFilter === "read") return !!c.is_read;
    return true;
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold">
        Contact Submissions ({contacts.length})
        {unreadCount > 0 && <Badge className="ms-2 bg-accent text-accent-foreground">{unreadCount} new</Badge>}
      </h2>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone or message..."
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>
            All ({contacts.length})
          </Button>
          <Button variant={statusFilter === "unread" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("unread")}>
            Unread ({unreadCount})
          </Button>
          <Button variant={statusFilter === "read" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("read")}>
            Read ({readCount})
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredContacts.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg border bg-card p-4 ${!c.is_read ? "border-accent" : "border-border"}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.email} {c.phone && `• ${c.phone}`}</p>
                <p className="mt-2 text-sm">{c.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(c.submitted_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {!c.is_read && (
                  <Button variant="ghost" size="icon" onClick={() => markRead(c.id)} title="Mark as read">
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete message?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This message will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
        {filteredContacts.length === 0 && <p className="text-center text-muted-foreground py-8">No submissions found for this filter.</p>}
      </div>
    </div>
  );
}
