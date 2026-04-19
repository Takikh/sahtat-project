import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { exportToCsv } from "@/lib/csvExport";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Eye, Download } from "lucide-react";

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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    await fetchContacts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    await fetchContacts();
  };

  const unreadCount = contacts.filter((contact) => !contact.is_read).length;
  const readCount = contacts.length - unreadCount;

  const filteredContacts = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesSearch =
        !normalizedQuery ||
        contact.name.toLowerCase().includes(normalizedQuery) ||
        contact.email.toLowerCase().includes(normalizedQuery) ||
        contact.message.toLowerCase().includes(normalizedQuery) ||
        (contact.phone || "").toLowerCase().includes(normalizedQuery);

      if (!matchesSearch) return false;

      if (fromDate) {
        const submitted = new Date(contact.submitted_at);
        const start = new Date(`${fromDate}T00:00:00`);
        if (submitted < start) return false;
      }

      if (toDate) {
        const submitted = new Date(contact.submitted_at);
        const end = new Date(`${toDate}T23:59:59`);
        if (submitted > end) return false;
      }

      if (statusFilter === "unread") return !contact.is_read;
      if (statusFilter === "read") return !!contact.is_read;
      return true;
    });
  }, [contacts, search, statusFilter, fromDate, toDate]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => filteredContacts.some((contact) => contact.id === id)));
  }, [filteredContacts]);

  const allVisibleSelected = filteredContacts.length > 0 && filteredContacts.every((contact) => selectedIds.includes(contact.id));

  const toggleSelectAllVisible = (checked: boolean) => {
    if (!checked) {
      setSelectedIds((prev) => prev.filter((id) => !filteredContacts.some((contact) => contact.id === id)));
      return;
    }

    const ids = filteredContacts.map((contact) => contact.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const markSelectedRead = async () => {
    if (!selectedIds.length) return;
    await supabase.from("contact_submissions").update({ is_read: true }).in("id", selectedIds);
    setSelectedIds([]);
    await fetchContacts();
  };

  const exportFiltered = () => {
    if (!filteredContacts.length) {
      toast({ title: "No data", description: "No contact submissions to export for current filters." });
      return;
    }

    exportToCsv(
      filteredContacts.map((contact) => ({
        submitted_at: contact.submitted_at,
        name: contact.name,
        email: contact.email,
        phone: contact.phone || "",
        is_read: contact.is_read ? "read" : "unread",
        message: contact.message,
      })),
      `contacts-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  };

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold">
        Contact Submissions ({contacts.length})
        {unreadCount > 0 && <Badge className="ms-2 bg-accent text-accent-foreground">{unreadCount} new</Badge>}
      </h2>

      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto_auto]">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email, phone or message..."
        />
        <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
        <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />

        <div className="flex flex-wrap gap-2">
          <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>All ({contacts.length})</Button>
          <Button variant={statusFilter === "unread" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("unread")}>Unread ({unreadCount})</Button>
          <Button variant={statusFilter === "read" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("read")}>Read ({readCount})</Button>
        </div>

        <Button variant="outline" size="sm" onClick={markSelectedRead} disabled={!selectedIds.length}>Mark selected read</Button>
        <Button variant="outline" size="sm" className="gap-2" onClick={exportFiltered}><Download className="h-4 w-4" />Export CSV</Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-card p-3">
        <Checkbox checked={allVisibleSelected} onCheckedChange={(value) => toggleSelectAllVisible(Boolean(value))} />
        <p className="text-sm text-muted-foreground">Select all visible rows ({filteredContacts.length})</p>
      </div>

      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className={`rounded-lg border bg-card p-4 ${!contact.is_read ? "border-accent" : "border-border"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedIds.includes(contact.id)}
                  onCheckedChange={(value) => {
                    const checked = Boolean(value);
                    setSelectedIds((prev) => {
                      if (checked) return Array.from(new Set([...prev, contact.id]));
                      return prev.filter((id) => id !== contact.id);
                    });
                  }}
                />
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.email} {contact.phone && `• ${contact.phone}`}</p>
                  <p className="mt-2 text-sm">{contact.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{new Date(contact.submitted_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {!contact.is_read && (
                  <Button variant="ghost" size="icon" onClick={() => markRead(contact.id)} title="Mark as read">
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
                      <AlertDialogAction onClick={() => handleDelete(contact.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && <p className="py-8 text-center text-muted-foreground">No submissions found for this filter.</p>}
      </div>
    </div>
  );
}
