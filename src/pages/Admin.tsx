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
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Newspaper, Mail, Users, BarChart3, UserCog, Construction, MessageSquare, MapPinned } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Admin = () => {
  const { isSecretary, isSuperAdmin } = useAuth();

  const canManageContent = isSecretary || isSuperAdmin;
  const canManageCore = !isSecretary || isSuperAdmin;

  return (
    <Layout>
      <section className="bg-primary py-8 text-primary-foreground">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Tableau de Bord Admin</h1>
            <p className="mt-1 text-sm opacity-80">Gérez le contenu de votre site</p>
          </div>
          <Button asChild className="bg-white text-primary font-semibold hover:bg-white/90">
            <Link to="/dashboard">
              <ArrowLeft className="me-2 h-4 w-4" />
              Mon Espace
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <Tabs defaultValue={canManageContent ? "news" : "analytics"}>
            <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-1">
              {canManageCore && (
                <TabsTrigger value="analytics" className="gap-2 font-semibold text-foreground/80 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <BarChart3 className="h-4 w-4" /> Analytiques
                </TabsTrigger>
              )}
              {canManageCore && (
                <TabsTrigger value="projects" className="gap-2 font-semibold text-foreground/80 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Building2 className="h-4 w-4" /> Projets
                </TabsTrigger>
              )}
              <TabsTrigger value="progress" className="gap-2 font-semibold text-foreground/80 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Construction className="h-4 w-4" /> Avancement
              </TabsTrigger>
              {canManageCore && (
                <TabsTrigger value="clients" className="gap-2 font-semibold text-foreground/80 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Users className="h-4 w-4" /> Propriétés Clients
                </TabsTrigger>
              )}
              {isSuperAdmin && (
                <TabsTrigger value="users" className="gap-2 font-semibold text-foreground/80 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <UserCog className="h-4 w-4" /> Utilisateurs
                </TabsTrigger>
              )}
              <TabsTrigger value="news" className="gap-2 font-semibold text-foreground/80 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Newspaper className="h-4 w-4" /> Actualités
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2 font-semibold text-foreground/80 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <MessageSquare className="h-4 w-4" /> Avis Clients
              </TabsTrigger>
              {canManageCore && (
                <TabsTrigger value="contacts" className="gap-2 font-semibold text-foreground/80 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Mail className="h-4 w-4" /> Messages
                </TabsTrigger>
              )}
              {canManageCore && (
                <TabsTrigger value="land-offers" className="gap-2 font-semibold text-foreground/80 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <MapPinned className="h-4 w-4" /> Terrains
                </TabsTrigger>
              )}
            </TabsList>

            {canManageCore && <TabsContent value="analytics"><AdminAnalytics /></TabsContent>}
            {canManageCore && <TabsContent value="projects"><AdminProjects /></TabsContent>}
            <TabsContent value="progress"><AdminProgressUpdates /></TabsContent>
            {canManageCore && <TabsContent value="clients"><AdminClients /></TabsContent>}
            {isSuperAdmin && <TabsContent value="users"><AdminUsers /></TabsContent>}
            <TabsContent value="news"><AdminNews /></TabsContent>
            <TabsContent value="reviews"><AdminReviews /></TabsContent>
            {canManageCore && <TabsContent value="contacts"><AdminContacts /></TabsContent>}
            {canManageCore && <TabsContent value="land-offers"><AdminLandOffers /></TabsContent>}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;

