import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: string | null;
  isAdmin: boolean;
  isSecretary: boolean;
  isSuperAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSecretary, setIsSecretary] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const checkRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .returns<Array<{ role: string }>>();

    const roles = (data || []).map((r) => r.role);

    const nextRole = roles.includes("super_admin")
      ? "super_admin"
      : roles.includes("admin")
        ? "admin"
        : roles.includes("secretary")
          ? "secretary"
          : roles.includes("client")
            ? "client"
            : null;

    const staff = roles.some((r) => r === "admin" || r === "secretary" || r === "super_admin");

    setRole(nextRole);
    setIsAdmin(staff);
    setIsSecretary(roles.includes("secretary"));
    setIsSuperAdmin(roles.includes("super_admin"));
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkRole(session.user.id);
        } else {
          setRole(null);
          setIsAdmin(false);
          setIsSecretary(false);
          setIsSuperAdmin(false);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut({ scope: "global" });
    setSession(null);
    setUser(null);
    setRole(null);
    setIsAdmin(false);
    setIsSecretary(false);
    setIsSuperAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, role, isAdmin, isSecretary, isSuperAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
