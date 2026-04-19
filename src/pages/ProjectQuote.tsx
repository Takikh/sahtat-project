import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSeo } from "@/hooks/useSeo";
import { supabase } from "@/integrations/supabase/client";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

type ProjectLite = {
  id: string;
  slug: string;
  name: string;
  city: string;
};

type ProjectUnitType = {
  id: string;
  type_code: string;
  label_en: string | null;
  label_fr: string | null;
  label_ar: string | null;
  status: string;
};

type QuoteFormState = {
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  financingType: string;
  wilaya: string;
  desiredApartmentType: string;
  parkingNeeded: string;
  budgetMin: string;
  budgetMax: string;
  preferredContactMethod: "phone" | "email" | "whatsapp";
  message: string;
};

const initialForm: QuoteFormState = {
  fullName: "",
  email: "",
  phone: "",
  profession: "",
  financingType: "",
  wilaya: "",
  desiredApartmentType: "",
  parkingNeeded: "no_preference",
  budgetMin: "",
  budgetMax: "",
  preferredContactMethod: "phone",
  message: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const pickLocalizedUnitLabel = (lang: "en" | "fr" | "ar", unit: ProjectUnitType) => {
  if (lang === "fr") return unit.label_fr || unit.label_en || unit.type_code;
  if (lang === "ar") return unit.label_ar || unit.label_en || unit.type_code;
  return unit.label_en || unit.type_code;
};

const toNullableNumber = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const ProjectQuote = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const [project, setProject] = useState<ProjectLite | null>(null);
  const [unitTypes, setUnitTypes] = useState<ProjectUnitType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<QuoteFormState>(initialForm);

  useSeo({
    title: project ? `${project.name} | ${t("projects.requestQuote", "Request a Quote")}` : t("projects.requestQuote", "Request a Quote"),
    description: t("projects.quoteSubtitle", "Share your needs and receive a tailored quote for this project."),
    canonicalPath: project ? `/projects/${project.slug || project.id}/quote` : "/projects",
    type: "website",
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      const bySlug = await supabase
        .from("projects")
        .select("id, slug, name, city")
        .eq("slug", id)
        .maybeSingle();

      const projectData = bySlug.data
        ? (bySlug.data as ProjectLite)
        : ((await supabase.from("projects").select("id, slug, name, city").eq("id", id).maybeSingle()).data as ProjectLite | null);

      if (!projectData) {
        setProject(null);
        setUnitTypes([]);
        setLoading(false);
        return;
      }

      setProject(projectData);

      const { data: unitData } = await supabase
        .from("project_unit_types")
        .select("id, type_code, label_en, label_fr, label_ar, status")
        .eq("project_id", projectData.id)
        .order("sort_order", { ascending: true });

      setUnitTypes((unitData as ProjectUnitType[] | null) || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const validate = () => {
    if (form.fullName.trim().length < 2) return t("contact.errors.name", "Please enter a valid name.");
    if (!emailRegex.test(form.email.trim())) return t("contact.errors.email", "Please enter a valid email address.");
    if (form.phone.trim().length < 8) return t("sellLand.errors.phone", "Please enter a valid phone number.");

    const min = toNullableNumber(form.budgetMin);
    const max = toNullableNumber(form.budgetMax);
    if (min !== null && max !== null && min > max) {
      return t("projects.quoteBudgetError", "Minimum budget cannot be greater than maximum budget.");
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast({ title: t("common.error", "Error"), description: validationError, variant: "destructive" });
      return;
    }

    if (!project) return;

    setSubmitting(true);
    const { error } = await supabase.from("project_quote_requests").insert({
      project_id: project.id,
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      profession: form.profession.trim() || null,
      financing_type: form.financingType.trim() || null,
      wilaya: form.wilaya.trim() || null,
      desired_apartment_type: form.desiredApartmentType || null,
      parking_needed:
        form.parkingNeeded === "yes"
          ? true
          : form.parkingNeeded === "no"
            ? false
            : null,
      budget_min_dzd: toNullableNumber(form.budgetMin),
      budget_max_dzd: toNullableNumber(form.budgetMax),
      preferred_contact_method: form.preferredContactMethod,
      message: form.message.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: t("common.error", "Error"), description: error.message, variant: "destructive" });
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
    toast({
      title: t("projects.quoteSuccessTitle", "Quote request sent"),
      description: t("projects.quoteSuccessDescription", "Our team will contact you with a tailored offer."),
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground">Loading...</div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">{t("projects.notFound", "Project not found")}</h1>
          <Button asChild className="mt-4">
            <Link to="/projects">{t("projects.title")}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container max-w-3xl">
          <PageBreadcrumbs
            className="mb-4"
            items={[
              { label: t("nav.home", "Home"), href: "/" },
              { label: t("projects.title"), href: "/projects" },
              { label: project.name, href: `/projects/${project.slug || project.id}` },
              { label: t("projects.requestQuote", "Request a Quote") },
            ]}
          />

          <Button asChild variant="ghost" size="sm">
            <Link to={`/projects/${project.slug || project.id}`}>
              <ArrowLeft className="me-2 h-4 w-4" />
              {t("projects.backToProject", "Back to project")}
            </Link>
          </Button>

          <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h1 className="font-display text-3xl font-bold">{t("projects.requestQuote", "Request a Quote")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {project.name} • {project.city}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("projects.quoteSubtitle", "Tell us your profile and preferences so our sales team can prepare a personalized offer.")}
            </p>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-muted-foreground">
                {t("projects.quoteSuccessDescription", "Our team will contact you with a tailored offer.")}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-4" noValidate>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>{t("sellLand.fullName", "Full name")} *</Label>
                    <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1.5" required />
                  </div>
                  <div>
                    <Label>{t("contact.formPhone", "Phone")} *</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" required />
                  </div>
                  <div>
                    <Label>{t("contact.formEmail", "Email")} *</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" required />
                  </div>
                  <div>
                    <Label>{t("projects.quoteProfession", "Profession")}</Label>
                    <Input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>{t("projects.quoteFinancingType", "Financing type")}</Label>
                    <Input value={form.financingType} onChange={(e) => setForm({ ...form, financingType: e.target.value })} className="mt-1.5" placeholder={t("projects.quoteFinancingPlaceholder", "Cash, mortgage, mixed...")} />
                  </div>
                  <div>
                    <Label>{t("projects.quoteWilaya", "Wilaya")}</Label>
                    <Input value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>{t("projects.quoteApartmentType", "Desired apartment type")}</Label>
                    <Select value={form.desiredApartmentType || "none"} onValueChange={(value) => setForm({ ...form, desiredApartmentType: value === "none" ? "" : value })}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder={t("projects.quoteSelectType", "Select a type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t("projects.quoteNoPreference", "No preference")}</SelectItem>
                        {unitTypes.map((unit) => (
                          <SelectItem key={unit.id} value={unit.type_code}>{pickLocalizedUnitLabel(lang, unit)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("projects.quoteParkingNeed", "Parking needed")}</Label>
                    <Select value={form.parkingNeeded} onValueChange={(value) => setForm({ ...form, parkingNeeded: value })}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_preference">{t("projects.quoteNoPreference", "No preference")}</SelectItem>
                        <SelectItem value="yes">{t("common.yes", "Yes")}</SelectItem>
                        <SelectItem value="no">{t("common.no", "No")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>{t("projects.quoteBudgetMin", "Budget min (DZD)")}</Label>
                    <Input type="number" min={0} value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>{t("projects.quoteBudgetMax", "Budget max (DZD)")}</Label>
                    <Input type="number" min={0} value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })} className="mt-1.5" />
                  </div>
                </div>

                <div>
                  <Label>{t("projects.quotePreferredContact", "Preferred contact method")}</Label>
                  <Select value={form.preferredContactMethod} onValueChange={(value) => setForm({ ...form, preferredContactMethod: value as QuoteFormState["preferredContactMethod"] })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">{t("contact.call", "Call")}</SelectItem>
                      <SelectItem value="email">{t("contact.formEmail", "Email")}</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t("contact.formMessage", "Message")}</Label>
                  <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5" placeholder={t("projects.quoteMessagePlaceholder", "Tell us your priorities: floor, orientation, delivery timeline, etc.")} />
                </div>

                <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {submitting ? t("contact.sending", "Sending...") : t("projects.requestQuote", "Request a Quote")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectQuote;
