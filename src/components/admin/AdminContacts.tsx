import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Eye } from "lucide-react";

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
  const [contacts, setContacts] = useState<ContactRow[]>([]);

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });
    if (data) setContacts(data as any);
  };

  useEffect(() => { fetchContacts(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    fetchContacts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    fetchContacts();
  };

  const unreadCount = contacts.filter(c => !c.is_read).length;

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold">
        Contact Submissions ({contacts.length})
        {unreadCount > 0 && <Badge className="ms-2 bg-accent text-accent-foreground">{unreadCount} new</Badge>}
      </h2>

      <div className="space-y-3">
        {contacts.map((c) => (
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
                <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {contacts.length === 0 && <p className="text-center text-muted-foreground py-8">No submissions yet.</p>}
      </div>
    </div>
  );
}
