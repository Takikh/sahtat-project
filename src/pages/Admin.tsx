import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminNews } from "@/components/admin/AdminNews";
import { AdminContacts } from "@/components/admin/AdminContacts";
import { AdminClients } from "@/components/admin/AdminClients";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminProgressUpdates } from "@/components/admin/AdminProgressUpdates";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminLandOffers } from "@/components/admin/AdminLandOffers";
import { AdminFaqs } from "@/components/admin/AdminFaqs";
import { AdminQuotes } from "@/components/admin/AdminQuotes";
import { AdminUnitTypes } from "@/components/admin/AdminUnitTypes";
import { AdminReporting } from "@/components/admin/AdminReporting";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Newspaper, Mail, Users, BarChart3, UserCog, Construction, MessageSquare, MapPinned, CircleHelp, LogOut, LayoutGrid, ClipboardList, LineChart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

const Admin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin, signOut } = useAuth();

  const canManageContent = isAdmin;
  const canManageCore = isAdmin;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <Layout>
      <section className="bg-gradient-to-r from-primary via-primary/95 to-accent/70 py-8 text-primary-foreground dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">{t("admin.title", "Admin Dashboard")}</h1>
            <p className="mt-1 text-sm opacity-80">{t("admin.subtitle", "Manage your website content and client operations")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="border border-primary-foreground/30 bg-primary-foreground/10 font-semibold text-primary-foreground hover:bg-primary-foreground/20 dark:border-slate-300/25 dark:text-slate-100 dark:hover:bg-slate-100/15">
              <Link to="/dashboard">
                <ArrowLeft className="me-2 h-4 w-4" />
                {t("admin.backToDashboard", "My Space")}
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/15 dark:border-slate-300/25 dark:text-slate-100 dark:hover:bg-slate-100/15">
              <LogOut className="me-2 h-4 w-4" />
              {t("dashboard.signOut", "Sign out")}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <Tabs defaultValue={canManageContent ? "news" : "analytics"}>
            <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-1 rounded-xl border border-border/70 bg-card/80 p-2 backdrop-blur supports-[backdrop-filter]:bg-card/70">
              {canManageCore && (
                <TabsTrigger value="analytics" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <BarChart3 className="h-4 w-4" /> {t("admin.tabs.analytics", "Analytics")}
                </TabsTrigger>
              )}
              {canManageCore && (
                <TabsTrigger value="projects" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Building2 className="h-4 w-4" /> {t("admin.tabs.projects", "Projects")}
                </TabsTrigger>
              )}
              {canManageCore && (
                <TabsTrigger value="unit-types" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <LayoutGrid className="h-4 w-4" /> {t("admin.tabs.unitTypes", "Apartment Types")}
                </TabsTrigger>
              )}
              <TabsTrigger value="progress" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Construction className="h-4 w-4" /> {t("admin.tabs.progress", "Progress")}
              </TabsTrigger>
              {canManageCore && (
                <TabsTrigger value="quotes" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <ClipboardList className="h-4 w-4" /> {t("admin.tabs.quotes", "Quotes")}
                </TabsTrigger>
              )}
              {canManageCore && (
                <TabsTrigger value="reporting" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <LineChart className="h-4 w-4" /> {t("admin.tabs.reporting", "Lead Reporting")}
                </TabsTrigger>
              )}
              {canManageCore && (
                <TabsTrigger value="clients" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Users className="h-4 w-4" /> {t("admin.tabs.clients", "Client Properties")}
                </TabsTrigger>
              )}
              {isSuperAdmin && (
                <TabsTrigger value="users" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <UserCog className="h-4 w-4" /> {t("admin.tabs.users", "Users")}
                </TabsTrigger>
              )}
              <TabsTrigger value="news" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Newspaper className="h-4 w-4" /> {t("admin.tabs.news", "News")}
              </TabsTrigger>
              {canManageCore && (
                <TabsTrigger value="reviews" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <MessageSquare className="h-4 w-4" /> {t("admin.tabs.reviews", "Reviews")}
                </TabsTrigger>
              )}
              <TabsTrigger value="faqs" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <CircleHelp className="h-4 w-4" /> {t("admin.tabs.faqs", "FAQs")}
              </TabsTrigger>
              {canManageCore && (
                <TabsTrigger value="contacts" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Mail className="h-4 w-4" /> {t("admin.tabs.messages", "Messages")}
                </TabsTrigger>
              )}
              {canManageCore && (
                <TabsTrigger value="land-offers" className="gap-2 font-semibold text-foreground/80 hover:bg-muted/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <MapPinned className="h-4 w-4" /> {t("admin.tabs.landOffers", "Land Offers")}
                </TabsTrigger>
              )}
            </TabsList>

            {canManageCore && <TabsContent value="analytics"><AdminAnalytics /></TabsContent>}
            {canManageCore && <TabsContent value="projects"><AdminProjects /></TabsContent>}
            {canManageCore && <TabsContent value="unit-types"><AdminUnitTypes /></TabsContent>}
            <TabsContent value="progress"><AdminProgressUpdates /></TabsContent>
            {canManageCore && <TabsContent value="quotes"><AdminQuotes /></TabsContent>}
            {canManageCore && <TabsContent value="reporting"><AdminReporting /></TabsContent>}
            {canManageCore && <TabsContent value="clients"><AdminClients /></TabsContent>}
            {isSuperAdmin && <TabsContent value="users"><AdminUsers /></TabsContent>}
            <TabsContent value="news"><AdminNews /></TabsContent>
            {canManageCore && <TabsContent value="reviews"><AdminReviews /></TabsContent>}
            <TabsContent value="faqs"><AdminFaqs /></TabsContent>
            {canManageCore && <TabsContent value="contacts"><AdminContacts /></TabsContent>}
            {canManageCore && <TabsContent value="land-offers"><AdminLandOffers /></TabsContent>}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;

