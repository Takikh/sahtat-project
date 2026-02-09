import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminNews } from "@/components/admin/AdminNews";
import { AdminContacts } from "@/components/admin/AdminContacts";
import { AdminClients } from "@/components/admin/AdminClients";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Newspaper, Mail, Users, BarChart3 } from "lucide-react";

const Admin = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section className="bg-primary py-8 text-primary-foreground">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm opacity-80">Manage your website content</p>
          </div>
          <Button asChild variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/dashboard">
              <ArrowLeft className="me-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <Tabs defaultValue="analytics">
            <TabsList className="mb-6 w-full justify-start gap-2">
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <Building2 className="h-4 w-4" /> Projects
              </TabsTrigger>
              <TabsTrigger value="news" className="gap-2">
                <Newspaper className="h-4 w-4" /> News
              </TabsTrigger>
              <TabsTrigger value="contacts" className="gap-2">
                <Mail className="h-4 w-4" /> Contact Submissions
              </TabsTrigger>
              <TabsTrigger value="clients" className="gap-2">
                <Users className="h-4 w-4" /> Clients
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics"><AdminAnalytics /></TabsContent>
            <TabsContent value="projects"><AdminProjects /></TabsContent>
            <TabsContent value="news"><AdminNews /></TabsContent>
            <TabsContent value="contacts"><AdminContacts /></TabsContent>
            <TabsContent value="clients"><AdminClients /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
