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

const trustStats = [
  { label: "Projets livrés", value: "10+", icon: Building2 },
  { label: "Réponse moyenne", value: "< 24h", icon: Clock3 },
  { label: "Accompagnement", value: "100%", icon: ShieldCheck },
];

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

  const validate = () => {
    const nextErrors: ContactErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = "Veuillez entrer un nom valide (2 caractères minimum).";
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailOk) {
      nextErrors.email = "Veuillez entrer une adresse email valide.";
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      nextErrors.message = "Votre message doit contenir au moins 10 caractères.";
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
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      setErrors({});
      toast({ title: t("contact.formSuccess") });
    }
  };

  const validateOffer = () => {
    const nextErrors: LandOfferErrors = {};

    if (!offer.fullName.trim() || offer.fullName.trim().length < 2) {
      nextErrors.fullName = "Veuillez entrer un nom valide.";
    }

    if (!offer.phone.trim() || offer.phone.trim().length < 8) {
      nextErrors.phone = "Veuillez entrer un numéro de téléphone valide.";
    }

    if (!offer.city.trim()) {
      nextErrors.city = "Veuillez indiquer la ville.";
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
        `Ville: ${offer.city.trim()}`,
        offer.district.trim() ? `Zone: ${offer.district.trim()}` : null,
        offer.areaM2 ? `Superficie: ${offer.areaM2} m²` : null,
        offer.askingPrice ? `Prix demandé: ${offer.askingPrice} DZD` : null,
        offer.ownershipType.trim() ? `Type propriété: ${offer.ownershipType.trim()}` : null,
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
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
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
    toast({ title: "Proposition envoyée", description: "Nous vous contacterons après étude du terrain." });
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
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="mt-4 font-display text-xl font-semibold">{t("contact.formSuccess")}</p>
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
                    placeholder="Nom complet"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
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
                    placeholder="exemple@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
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
                    placeholder="0660 84 02 71"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
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
                    placeholder="Décrivez votre besoin..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                  {loading ? "Envoi en cours..." : t("contact.formSubmit")}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Info & Map */}
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
                <p className="text-sm font-medium text-foreground">Réponse rapide garantie</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Notre équipe commerciale vous répond en général en moins de 24h ouvrées.
                </p>
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
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Instagram className="h-5 w-5" />
                @sahtat_promotion_medea
              </a>
            </div>

            {/* Map – Médéa city centre */}
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

      <section className="pb-28 md:pb-20">
        <div className="container">
          <div className="mb-5">
            <h2 className="font-display text-2xl font-bold">Vous avez un terrain à vendre ?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Soumettez les informations du terrain. Notre équipe étudie votre proposition et vous recontacte.
            </p>
          </div>

          {offerSubmitted ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="font-semibold">Merci, votre proposition de terrain a bien été reçue.</p>
              <p className="mt-1 text-sm text-muted-foreground">Nous reviendrons vers vous dès qu&apos;un chargé d&apos;affaires examine le dossier.</p>
            </div>
          ) : (
            <form onSubmit={handleOfferSubmit} className="rounded-xl border border-border bg-card p-6" noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="offer-full-name">Nom complet *</Label>
                  <Input
                    id="offer-full-name"
                    className="mt-1.5"
                    value={offer.fullName}
                    onChange={(e) => setOffer({ ...offer, fullName: e.target.value })}
                    aria-invalid={!!offerErrors.fullName}
                  />
                  {offerErrors.fullName && <p className="mt-1 text-xs text-destructive">{offerErrors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="offer-phone">Téléphone *</Label>
                  <Input
                    id="offer-phone"
                    className="mt-1.5"
                    value={offer.phone}
                    onChange={(e) => setOffer({ ...offer, phone: e.target.value })}
                    aria-invalid={!!offerErrors.phone}
                  />
                  {offerErrors.phone && <p className="mt-1 text-xs text-destructive">{offerErrors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="offer-email">Email</Label>
                  <Input
                    id="offer-email"
                    type="email"
                    className="mt-1.5"
                    value={offer.email}
                    onChange={(e) => setOffer({ ...offer, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="offer-city">Ville *</Label>
                  <Input
                    id="offer-city"
                    className="mt-1.5"
                    value={offer.city}
                    onChange={(e) => setOffer({ ...offer, city: e.target.value })}
                    aria-invalid={!!offerErrors.city}
                  />
                  {offerErrors.city && <p className="mt-1 text-xs text-destructive">{offerErrors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="offer-district">Quartier / Zone</Label>
                  <Input
                    id="offer-district"
                    className="mt-1.5"
                    value={offer.district}
                    onChange={(e) => setOffer({ ...offer, district: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="offer-area">Superficie (m²)</Label>
                  <Input
                    id="offer-area"
                    type="number"
                    min={0}
                    className="mt-1.5"
                    value={offer.areaM2}
                    onChange={(e) => setOffer({ ...offer, areaM2: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="offer-price">Prix demandé (DZD)</Label>
                  <Input
                    id="offer-price"
                    type="number"
                    min={0}
                    className="mt-1.5"
                    value={offer.askingPrice}
                    onChange={(e) => setOffer({ ...offer, askingPrice: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="offer-owner">Type de propriété</Label>
                  <Input
                    id="offer-owner"
                    className="mt-1.5"
                    placeholder="Acte, indivision, etc."
                    value={offer.ownershipType}
                    onChange={(e) => setOffer({ ...offer, ownershipType: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="offer-description">Informations complémentaires</Label>
                <Textarea
                  id="offer-description"
                  className="mt-1.5"
                  rows={4}
                  value={offer.description}
                  onChange={(e) => setOffer({ ...offer, description: e.target.value })}
                  placeholder="Accès, documents disponibles, contraintes urbanisme, etc."
                />
              </div>

              <Button type="submit" className="mt-5" disabled={offerLoading}>
                {offerLoading ? "Envoi..." : "Envoyer la proposition"}
              </Button>
            </form>
          )}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="container grid grid-cols-2 gap-2">
          <a
            href="tel:+213660840271"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium"
          >
            <Phone className="h-4 w-4" />
            Appeler
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
