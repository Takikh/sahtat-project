import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <img src="/logo.svg" alt="Sahtat Promotion" className="h-20 w-auto brightness-0 invert" />
            <p className="mt-3 text-sm opacity-80">{t("footer.description")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/" className="hover:text-accent transition-colors">{t("nav.home")}</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">{t("nav.about")}</Link></li>
              <li><Link to="/projects" className="hover:text-accent transition-colors">{t("nav.projects")}</Link></li>
              <li><Link to="/services" className="hover:text-accent transition-colors">{t("nav.services")}</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              {t("footer.contactInfo")}
            </h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-accent" />
                {t("footer.address")}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                {t("footer.phone")}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                {t("footer.email")}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              {t("footer.followUs")}
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.facebook.com/SahtatPromotion/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent/20 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/30"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
              <a
                href="https://www.instagram.com/sahtat_promotion_medea/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent/20 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/30"
              >
                <Instagram className="h-5 w-5" />
                @sahtat_promotion_medea
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 text-xs opacity-60 sm:flex-row">
          <p>© {new Date().getFullYear()} Sahtat Promotion. {t("footer.rights")}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-accent transition-colors">{t("footer.privacy")}</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
