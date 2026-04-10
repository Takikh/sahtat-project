import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, MapPin } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";

type LandOfferErrors = {
  fullName?: string;
  phone?: string;
  city?: string;
};

const SellLand = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
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

  useSeo({
    title: `${t("sellLand.title")} | Sahtat Promotion`,
    description: t("sellLand.subtitle"),
    canonicalPath: "/sell-land",
    type: "website",
  });

  const validateOffer = () => {
    const nextErrors: LandOfferErrors = {};

    if (!offer.fullName.trim() || offer.fullName.trim().length < 2) {
      nextErrors.fullName = t("sellLand.errors.fullName", "Please enter a valid full name.");
    }

    if (!offer.phone.trim() || offer.phone.trim().length < 8) {
      nextErrors.phone = t("sellLand.errors.phone", "Please enter a valid phone number.");
    }

    if (!offer.city.trim()) {
      nextErrors.city = t("sellLand.errors.city", "Please provide the city.");
    }

    setOfferErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOffer()) return;

    setOfferLoading(true);
    const { error } = await supabase.from("land_offers").insert({
      full_name: offer.fullName.trim(),
      phone: offer.phone.trim(),
      email: offer.email.trim() || null,
      city: offer.city.trim(),
      district: offer.district.trim() || null,
      area_m2: offer.areaM2 ? Number(offer.areaM2) : null,
      asking_price: offer.askingPrice ? Number(offer.askingPrice) : null,
      ownership_type: offer.ownershipType.trim() || null,
      description: offer.description.trim() || null,
    });
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
      title: t("sellLand.successTitle", "Offer submitted"),
      description: t("sellLand.successDescription", "Our team will review your offer and contact you."),
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
            {t("sellLand.title")}
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">{t("sellLand.subtitle")}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {offerSubmitted ? (
            <div className="rounded-xl border border-border bg-card p-8">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="mt-4 text-lg font-semibold">{t("sellLand.thanksTitle", "Thank you, your land offer has been received.")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("sellLand.thanksSubtitle", "A business manager will review your file and contact you.")}</p>
            </div>
          ) : (
            <form onSubmit={handleOfferSubmit} className="rounded-xl border border-border bg-card p-6" noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="offer-full-name">{t("sellLand.fullName", "Full name")} *</Label>
                  <Input id="offer-full-name" className="mt-1.5" value={offer.fullName} onChange={(e) => setOffer({ ...offer, fullName: e.target.value })} aria-invalid={!!offerErrors.fullName} />
                  {offerErrors.fullName && <p className="mt-1 text-xs text-destructive">{offerErrors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="offer-phone">{t("sellLand.phone", "Phone")} *</Label>
                  <Input id="offer-phone" className="mt-1.5" value={offer.phone} onChange={(e) => setOffer({ ...offer, phone: e.target.value })} aria-invalid={!!offerErrors.phone} />
                  {offerErrors.phone && <p className="mt-1 text-xs text-destructive">{offerErrors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="offer-email">{t("sellLand.email", "Email")}</Label>
                  <Input id="offer-email" type="email" className="mt-1.5" value={offer.email} onChange={(e) => setOffer({ ...offer, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="offer-city">{t("sellLand.city", "City")} *</Label>
                  <Input id="offer-city" className="mt-1.5" value={offer.city} onChange={(e) => setOffer({ ...offer, city: e.target.value })} aria-invalid={!!offerErrors.city} />
                  {offerErrors.city && <p className="mt-1 text-xs text-destructive">{offerErrors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="offer-district">{t("sellLand.district", "District / Area")}</Label>
                  <Input id="offer-district" className="mt-1.5" value={offer.district} onChange={(e) => setOffer({ ...offer, district: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="offer-area">{t("sellLand.area", "Area (m2)")}</Label>
                  <Input id="offer-area" type="number" min={0} className="mt-1.5" value={offer.areaM2} onChange={(e) => setOffer({ ...offer, areaM2: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="offer-price">{t("sellLand.price", "Asking price (DZD)")}</Label>
                  <Input id="offer-price" type="number" min={0} className="mt-1.5" value={offer.askingPrice} onChange={(e) => setOffer({ ...offer, askingPrice: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="offer-owner">{t("sellLand.ownership", "Ownership type")}</Label>
                  <Input id="offer-owner" className="mt-1.5" placeholder={t("sellLand.ownershipPlaceholder", "Title deed, shared, etc.")} value={offer.ownershipType} onChange={(e) => setOffer({ ...offer, ownershipType: e.target.value })} />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="offer-description">{t("sellLand.description", "Additional information")}</Label>
                <Textarea
                  id="offer-description"
                  className="mt-1.5"
                  rows={4}
                  value={offer.description}
                  onChange={(e) => setOffer({ ...offer, description: e.target.value })}
                  placeholder={t("sellLand.descriptionPlaceholder", "Access, available documents, urban constraints, etc.")}
                />
              </div>

              <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-muted-foreground">
                {t("sellLand.microcopy", "After submission, we check legal and location potential, then contact you for follow-up.")}
              </div>

              <Button type="submit" className="mt-5" disabled={offerLoading}>
                {offerLoading ? t("contact.sending", "Sending...") : t("sellLand.submit", "Submit land offer")}
              </Button>
            </form>
          )}

          <aside className="space-y-4 rounded-xl border border-border bg-card p-6">
            <p className="text-sm font-semibold text-accent">{t("sellLand.sideTitle", "How we process your offer")}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("sellLand.step1", "1. We review legal documents and land status.")}</li>
              <li>{t("sellLand.step2", "2. We evaluate location potential and project viability.")}</li>
              <li>{t("sellLand.step3", "3. A business manager contacts you for next steps.")}</li>
            </ul>
            <div className="rounded-lg border border-border bg-secondary p-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium"><MapPin className="h-4 w-4 text-accent" /> {t("sellLand.coverage", "Primary coverage: Médéa and nearby areas")}</p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default SellLand;
