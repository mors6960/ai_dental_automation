import { motion } from "framer-motion";
import { Sparkles, Instagram, Facebook, Twitter, MapPin, Clock, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  const socialLinks = [
    { icon: Instagram, href: "#" },
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-dark pb-12 pt-24 text-white">
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="luxury-outline mb-20 flex flex-col items-center justify-between gap-8 rounded-3xl glass-dark p-10 md:flex-row md:p-14"
        >
          <div>
            <h3 className="display-sm text-white">{t.footer.ctaTitle}</h3>
            <p className="mt-4 max-w-md text-lg text-white/70">
              {t.footer.ctaDescription}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="btn-premium h-13 px-8 bg-gradient-primary hover:bg-gradient-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-2"
              asChild
            >
              <a href="#booking">
                {t.footer.book}
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-12"
        >
          {/* Brand */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 w-fit"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0px oklch(0.72 0.11 205 / 0.3)",
                    "0 0 0 8px oklch(0.72 0.11 205 / 0)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center"
              >
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="font-display text-xl font-semibold">
                Lumière<span className="text-gradient-gold"> Dental</span>
              </span>
            </motion.div>
            <p className="mt-5 text-sm leading-relaxed text-white/65">
              {t.footer.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={i}
                    href={link.href}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="grid h-10 w-10 place-items-center rounded-lg glass-dark transition-colors hover:bg-primary/30"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h4 className="font-semibold text-white mb-5">{t.footer.contact}</h4>
            <ul className="space-y-4 text-sm text-white/65">
              <motion.li
                whileHover={{ x: 4, color: "rgba(255, 255, 255, 1)" }}
                className="flex items-start gap-3 transition-colors"
              >
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>432 Park Ave, NYC</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 4, color: "rgba(255, 255, 255, 1)" }}
                className="flex items-start gap-3 transition-colors"
              >
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-primary transition-colors">
                  +1 (555) 123-4567
                </a>
              </motion.li>
              <motion.li
                whileHover={{ x: 4, color: "rgba(255, 255, 255, 1)" }}
                className="flex items-start gap-3 transition-colors"
              >
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a href="mailto:hello@lumiere.dental" className="hover:text-primary transition-colors">
                  hello@lumiere.dental
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Hours */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h4 className="font-semibold text-white mb-5">{t.footer.hours}</h4>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{t.footer.hoursWeekdays}</span>
              </li>
              <li className="ml-6 text-white/50">{t.footer.hoursSaturday}</li>
              <li className="ml-6 text-white/50">{t.footer.hoursSunday}</li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <h4 className="font-semibold text-white mb-5">{t.footer.services}</h4>
            <ul className="space-y-2 text-sm text-white/65">
              {t.footer.servicesList.map((service) => (
                <motion.li
                  key={service}
                  whileHover={{ x: 4, color: "rgba(255, 255, 255, 1)" }}
                  className="transition-colors cursor-pointer"
                >
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row"
        >
          <span>© {new Date().getFullYear()} Lumière Dental. {t.footer.rights}</span>
          <span className="text-center md:text-right">{t.footer.compliance}</span>
        </motion.div>
      </div>
    </footer>
  );
}
