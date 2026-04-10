import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, MessageCircle, Facebook, CheckCircle, Instagram, Clock3, ShieldCheck, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FaqSection } from "@/components/shared/FaqSection";
import { useSeo } from "@/hooks/useSeo";

type ContactErrors = {
  name?: string;
  email?: string;
  message?: string;
};

type LandOfferErrors = {
  fullName?: string;
  phone?: string;
  city?: string;
};

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerErrors, setOfferErrors] = useState<LandOfferErrors>({});
  const [offer, setOffer] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    areaM2: "",
    askingPrice: "",
    ownershipType: "",
    description: "",
  });

  const trustStats = [
    { label: t("contact.trustDelivered", "Delivered projects"), value: "10+", icon: Building2 },
    { label: t("contact.trustResponse", "Average response"), value: "< 24h", icon: Clock3 },
    { label: t("contact.trustSupport", "Support"), value: "100%", icon: ShieldCheck },
  ];

  useSeo({
    title: `${t("contact.title")} | Sahtat Promotion`,
    description: t("contact.subtitle"),
    canonicalPath: "/contact",
    type: "website",
  });

  const validate = () => {
    const nextErrors: ContactErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = t("contact.errors.name", "Please enter a valid name (minimum 2 characters).");
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailOk) {
      nextErrors.email = t("contact.errors.email", "Please enter a valid email address.");
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      nextErrors.message = t("contact.errors.message", "Your message should contain at least 10 characters.");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    });
    setLoading(false);

    if (error) {
      toast({ title: t("common.error", "Error"), description: error.message, variant: "destructive" });
      return;
    }

    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    toast({ title: t("contact.formSuccess") });
  };

  const validateOffer = () => {
    const nextErrors: LandOfferErrors = {};

    if (!offer.fullName.trim() || offer.fullName.trim().length < 2) {
      nextErrors.fullName = t("contact.offer.errors.fullName", "Please enter a valid full name.");
    }

    if (!offer.phone.trim() || offer.phone.trim().length < 8) {
      nextErrors.phone = t("contact.offer.errors.phone", "Please enter a valid phone number.");
    }

    if (!offer.city.trim()) {
      nextErrors.city = t("contact.offer.errors.city", "Please provide the city.");
    }

    setOfferErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOffer()) return;

    setOfferLoading(true);
    const { error } = await supabase.from("land_offers" as never).insert({
      full_name: offer.fullName.trim(),
      phone: offer.phone.trim(),
      email: offer.email.trim() || null,
      city: offer.city.trim(),
      district: offer.district.trim() || null,
      area_m2: offer.areaM2 ? Number(offer.areaM2) : null,
      asking_price: offer.askingPrice ? Number(offer.askingPrice) : null,
      ownership_type: offer.ownershipType.trim() || null,
      description: offer.description.trim() || null,
    } as never);
    setOfferLoading(false);

    if (error) {
      const fallbackMessage = [
        "[LAND OFFER]",
        `City: ${offer.city.trim()}`,
        offer.district.trim() ? `District: ${offer.district.trim()}` : null,
        offer.areaM2 ? `Area: ${offer.areaM2} m2` : null,
        offer.askingPrice ? `Price: ${offer.askingPrice} DZD` : null,
        offer.ownershipType.trim() ? `Ownership: ${offer.ownershipType.trim()}` : null,
        offer.description.trim() ? `Notes: ${offer.description.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const { error: fallbackError } = await supabase.from("contact_submissions").insert({
        name: offer.fullName.trim(),
        email: offer.email.trim() || "no-email@land-offer.local",
        phone: offer.phone.trim(),
        message: fallbackMessage,
      });

      if (fallbackError) {
        toast({ title: t("common.error", "Error"), description: error.message, variant: "destructive" });
        return;
      }
    }

    setOfferSubmitted(true);
    setOfferErrors({});
    setOffer({
      fullName: "",
      phone: "",
      email: "",
      city: "",
      district: "",
      areaM2: "",
      askingPrice: "",
      ownershipType: "",
      description: "",
    });
    toast({
      title: t("contact.offer.successTitle", "Offer submitted"),
      description: t("contact.offer.successDescription", "Our team will review your offer and contact you."),
    });
  };

  return (
    <Layout>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold sm:text-5xl"
          >
            {t("contact.title")}
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl opacity-80">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="py-16 pb-14 sm:py-20">
        <div className="container grid gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="mt-4 font-display text-xl font-semibold">{t("contact.formSuccess")}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("contact.formAfterSubmit", "Our team reviews your request and contacts you with next steps.")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-8" noValidate>
                <div>
                  <Label htmlFor="name">{t("contact.formName")}</Label>
                  <Input
                    id="name"
                    required
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    className="mt-1.5"
                    placeholder={t("contact.placeholders.name", "Full name")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="email">{t("contact.formEmail")}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className="mt-1.5"
                    placeholder={t("contact.placeholders.email", "example@email.com")}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">{t("contact.formPhone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className="mt-1.5"
                    placeholder={t("contact.placeholders.phone", "Phone number")}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="message">{t("contact.formMessage")}</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    aria-invalid={!!errors.message}
                    className="mt-1.5"
                    placeholder={t("contact.placeholders.message", "Describe your need...")}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>}
                </div>
                <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-muted-foreground">
                  {t("contact.microcopy", "Average response time: less than one business day. Your details are used only to process your request.")}
                </div>
                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                  {loading ? t("contact.sending", "Sending...") : t("contact.formSubmit")}
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {trustStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center">
                  <stat.icon className="mx-auto h-5 w-5 text-accent" />
                  <p className="mt-2 font-display text-lg font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-card p-8">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold">{t("contact.location")}</p>
                  <p className="text-sm text-muted-foreground">{t("footer.address")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold">{t("footer.phone")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold">{t("footer.email")}</p>
                </div>
              </div>

              <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
                <p className="text-sm font-medium text-foreground">{t("contact.quickResponseTitle", "Fast response guaranteed")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("contact.quickResponseText", "Our commercial team usually replies in less than one business day.")}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/213660840271"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
              <a
                href="https://www.facebook.com/SahtatPromotion/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
              <a
                href="https://www.instagram.com/sahtat_promotion_medea/"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Instagram className="h-5 w-5" />
                @sahtat_promotion_medea
              </a>
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12786.999999999998!2d2.7521!3d36.2676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128f9c0f3b3b3b3b%3A0x4a0a9e23b3b3c4d1!2sM%C3%A9d%C3%A9a%2C%20Alg%C3%A9rie!5e0!3m2!1sfr!2sdz!4v1700000000000!5m2!1sfr!2sdz"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sahtat Promotion Location"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container">
          <div className="mb-5">
            <h2 className="font-display text-2xl font-bold">{t("contact.offer.title", "Do you have land for sale?")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("contact.offer.subtitle", "Submit your land details. Our team reviews your offer and contacts you with next steps.")}</p>
          </div>

          {offerSubmitted ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="font-semibold">{t("contact.offer.thanksTitle", "Thank you, your land offer has been received.")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("contact.offer.thanksSubtitle", "A business manager will review your file and contact you.")}</p>
            </div>
          ) : (
            <form onSubmit={handleOfferSubmit} className="rounded-xl border border-border bg-card p-6" noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="offer-full-name">{t("contact.offer.fullName", "Full name")} *</Label>
                  <Input id="offer-full-name" className="mt-1.5" value={offer.fullName} onChange={(e) => setOffer({ ...offer, fullName: e.target.value })} aria-invalid={!!offerErrors.fullName} />
                  {offerErrors.fullName && <p className="mt-1 text-xs text-destructive">{offerErrors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="offer-phone">{t("contact.offer.phone", "Phone")} *</Label>
                  <Input id="offer-phone" className="mt-1.5" value={offer.phone} onChange={(e) => setOffer({ ...offer, phone: e.target.value })} aria-invalid={!!offerErrors.phone} />
                  {offerErrors.phone && <p className="mt-1 text-xs text-destructive">{offerErrors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="offer-email">{t("contact.offer.email", "Email")}</Label>
                  <Input id="offer-email" type="email" className="mt-1.5" value={offer.email} onChange={(e) => setOffer({ ...offer, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="offer-city">{t("contact.offer.city", "City")} *</Label>
                  <Input id="offer-city" className="mt-1.5" value={offer.city} onChange={(e) => setOffer({ ...offer, city: e.target.value })} aria-invalid={!!offerErrors.city} />
                  {offerErrors.city && <p className="mt-1 text-xs text-destructive">{offerErrors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="offer-district">{t("contact.offer.district", "District / Area")}</Label>
                  <Input id="offer-district" className="mt-1.5" value={offer.district} onChange={(e) => setOffer({ ...offer, district: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="offer-area">{t("contact.offer.area", "Area (m2)")}</Label>
                  <Input id="offer-area" type="number" min={0} className="mt-1.5" value={offer.areaM2} onChange={(e) => setOffer({ ...offer, areaM2: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="offer-price">{t("contact.offer.price", "Asking price (DZD)")}</Label>
                  <Input id="offer-price" type="number" min={0} className="mt-1.5" value={offer.askingPrice} onChange={(e) => setOffer({ ...offer, askingPrice: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="offer-owner">{t("contact.offer.ownership", "Ownership type")}</Label>
                  <Input id="offer-owner" className="mt-1.5" placeholder={t("contact.offer.ownershipPlaceholder", "Title deed, shared, etc.")} value={offer.ownershipType} onChange={(e) => setOffer({ ...offer, ownershipType: e.target.value })} />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="offer-description">{t("contact.offer.description", "Additional information")}</Label>
                <Textarea
                  id="offer-description"
                  className="mt-1.5"
                  rows={4}
                  value={offer.description}
                  onChange={(e) => setOffer({ ...offer, description: e.target.value })}
                  placeholder={t("contact.offer.descriptionPlaceholder", "Access, available documents, urban constraints, etc.")}
                />
              </div>

              <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-muted-foreground">
                {t("contact.offer.microcopy", "After submission, we check legal and location potential, then contact you for follow-up.")}
              </div>

              <Button type="submit" className="mt-5" disabled={offerLoading}>
                {offerLoading ? t("contact.sending", "Sending...") : t("contact.offer.submit", "Submit land offer")}
              </Button>
            </form>
          )}
        </div>
      </section>

      <FaqSection
        page="contact"
        title={t("contact.faqTitle", "Contact FAQ")}
        subtitle={t("contact.faqSubtitle", "Response times, document handling, and what happens after your submission.")}
      />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="container grid grid-cols-2 gap-2">
          <a
            href="tel:+213660840271"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium"
          >
            <Phone className="h-4 w-4" />
            {t("contact.call", "Call")}
          </a>
          <a
            href="https://wa.me/213660840271"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-medium text-white"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
