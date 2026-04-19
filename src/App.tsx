import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { usePageTracking } from "@/hooks/usePageTracking";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { hasSupabaseEnv, supabaseConfigError } from "@/integrations/supabase/client";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ProjectQuote = lazy(() => import("./pages/ProjectQuote"));
const Services = lazy(() => import("./pages/Services"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const SellLand = lazy(() => import("./pages/SellLand"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AppRoutes() {
  usePageTracking();

  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/quote" element={<ProjectQuote />} />
        <Route path="/services" element={<Services />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sell-land" element={<SellLand />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppErrorBoundary>
          {hasSupabaseEnv ? (
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </AuthProvider>
          ) : (
            <div className="min-h-screen bg-background px-4 py-12 text-foreground">
              <div className="mx-auto max-w-2xl rounded-xl border border-destructive/40 bg-card p-6">
                <h1 className="font-display text-2xl font-bold text-destructive">Configuration Required</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  The app is missing Supabase runtime variables. Add VITE_SUPABASE_URL and
                  VITE_SUPABASE_PUBLISHABLE_KEY in your deployment environment.
                </p>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-secondary p-3 text-xs text-destructive">
                  {supabaseConfigError}
                </pre>
              </div>
            </div>
          )}
        </AppErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
