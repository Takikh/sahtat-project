import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Copy, Users, Phone, Shield, User, Eye, EyeOff } from "lucide-react";

interface UserRow {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  role?: string;
  email?: string;
}

export function AdminUsers() {
  const { toast } = useToast();
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "super_admin" | "admin" | "secretary" | "client">("all");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "client",
  });
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name, phone, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    const roleMap: Record<string, string> = {};
    if (rolesRes.data) {
      rolesRes.data.forEach((r) => {
        roleMap[r.user_id] = r.role;
      });
    }
    setRoles(roleMap);

    if (profilesRes.data) {
      setUsers(profilesRes.data as UserRow[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      toast({ title: "Error", description: "Email, password and full name are required.", variant: "destructive" });
      return;
    }
    if (newUser.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        body: {
          email: newUser.email,
          password: newUser.password,
          fullName: newUser.fullName,
          phone: newUser.phone || null,
          role: newUser.role,
        },
      });

      if (error) throw error;
      if (!data?.userId) throw new Error("User creation failed.");

      setCreatedCredentials({ email: newUser.email, password: newUser.password });
      toast({
        title: "✅ Account created",
        description: `Account for ${newUser.fullName} created. Share credentials with the client.`,
      });
      setNewUser({ email: "", password: "", fullName: "", phone: "", role: "client" });
      fetchUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account.";
      if (message.includes("already registered")) {
        toast({ title: "Error", description: "This email is already registered.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    }
    setCreating(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: newRole as never });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated" });
      fetchUsers();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return users.filter((u) => {
      const role = roles[u.user_id] || "client";
      const matchesRole = roleFilter === "all" || role === roleFilter;

      const matchesSearch =
        !q ||
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q) ||
        role.toLowerCase().includes(q);

      return matchesRole && matchesSearch;
    });
  }, [users, roles, search, roleFilter]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          User Management ({users.length})
        </h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setCreatedCredentials(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground">
              <Plus className="me-2 h-4 w-4" /> Create Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
            </DialogHeader>

            {createdCredentials ? (
              <div className="space-y-4 py-4">
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                  <p className="font-semibold text-green-600 mb-3">✅ Account created successfully!</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Share these credentials with the client. They can log in at{" "}
                    <strong>/auth</strong> and change their password from their profile.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md bg-card border border-border p-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-mono text-sm">{createdCredentials.email}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(createdCredentials.email)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-card border border-border p-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Password</p>
                        <p className="font-mono text-sm">{createdCredentials.password}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(createdCredentials.password)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-2">
                  ⚠️ If email confirmation is enabled in Supabase, the client must confirm their email first. 
                  You can disable it in Supabase Dashboard → Authentication → Settings.
                </p>
                <Button onClick={() => { setOpen(false); setCreatedCredentials(null); }} className="w-full">
                  Close
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    placeholder="Mohammed Benali"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="client@example.com"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Password *</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Min. 6 characters"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Phone (optional)</Label>
                  <Input
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="0660 84 02 71"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="secretary">Secretary</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreateUser}
                  disabled={creating}
                  className="bg-accent text-accent-foreground"
                >
                  {creating ? "Creating..." : "Create Account"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name, phone or role..."
          className="sm:max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button variant={roleFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setRoleFilter("all")}>All</Button>
          <Button variant={roleFilter === "client" ? "default" : "outline"} size="sm" onClick={() => setRoleFilter("client")}>Clients</Button>
          <Button variant={roleFilter === "secretary" ? "default" : "outline"} size="sm" onClick={() => setRoleFilter("secretary")}>Secretaries</Button>
          <Button variant={roleFilter === "admin" ? "default" : "outline"} size="sm" onClick={() => setRoleFilter("admin")}>Admins</Button>
          {isSuperAdmin && (
            <Button variant={roleFilter === "super_admin" ? "default" : "outline"} size="sm" onClick={() => setRoleFilter("super_admin")}>Super Admins</Button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading users...</p>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((u) => {
            const role = roles[u.user_id] || "client";
            return (
              <div key={u.user_id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    {role === "admin" ? (
                      <Shield className="h-5 w-5 text-accent" />
                    ) : (
                      <User className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{u.full_name || "Unnamed User"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {u.phone && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {u.phone}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Joined {new Date(u.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={role} onValueChange={(v) => handleRoleChange(u.user_id, v)}>
                    <SelectTrigger className="h-8 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="secretary">Secretary</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                    </SelectContent>
                  </Select>
                  <Badge variant={role === "admin" ? "default" : "secondary"} className="text-xs">
                    {role}
                  </Badge>
                </div>
              </div>
            );
          })}
          {filteredUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No users found for this filter.</p>
          )}
        </div>
      )}
    </div>
  );
}
