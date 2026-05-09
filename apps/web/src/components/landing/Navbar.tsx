import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, Languages, Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages, useI18n } from "@/lib/i18n";

export function Navbar() {
  const { language, setLanguage, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          animate={{
            background: scrolled
              ? "rgba(24, 30, 45, 0.7)"
              : "rgba(255, 255, 255, 0)",
            backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
          }}
          transition={{ duration: 0.3 }}
          className={`luxury-outline flex items-center justify-between rounded-2xl px-6 py-3 transition-all ${
            scrolled
              ? "glass shadow-elegant border border-white/10"
              : "border border-white/0 bg-transparent"
          }`}
        >
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{
                boxShadow: scrolled
                  ? "0 0 0 1px oklch(0.72 0.11 205 / 0.3), 0 16px 40px -16px oklch(0.64 0.15 210 / 0.3)"
                  : "0 0 0 1px oklch(0.72 0.11 205 / 0.1), 0 8px 20px -12px oklch(0.64 0.15 210 / 0.2)",
              }}
              className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span className="font-display text-base font-semibold tracking-tight text-white">
              Lumière<span className="text-gradient-gold"> Dental</span>
            </span>
          </motion.a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {t.nav.links.map((l, idx) => (
              <motion.a
                key={l.href}
                href={l.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white group"
              >
                <span className="relative">
                  {l.label}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-primary"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </motion.a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language selector */}
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/8 transition-colors">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as typeof language)}
              >
                <SelectTrigger className="h-7 min-w-[120px] border-0 bg-transparent px-1 text-xs text-white shadow-none focus:ring-0">
                  <SelectValue placeholder={t.nav.language} />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#101826]/95 text-white backdrop-blur-xl">
                  {languages.map((item) => (
                    <SelectItem
                      key={item.code}
                      value={item.code}
                      className="focus:bg-white/10 focus:text-white"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Call button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all"
              asChild
            >
              <a href="tel:+15551234567" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">{t.nav.call}</span>
              </a>
            </Button>

            {/* Book button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="btn-premium bg-gradient-primary hover:bg-gradient-primary text-primary-foreground rounded-lg shadow-glow font-semibold"
                asChild
              >
                <a href="#booking">{t.nav.book}</a>
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            whileTap={{ scale: 0.95 }}
          >
            {open ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="luxury-outline mt-3 flex flex-col gap-2 rounded-2xl glass p-4 lg:hidden"
          >
            {/* Language selector - Mobile */}
            <div className="mb-2 rounded-lg border border-white/10 bg-white/5 p-2">
              <div className="mb-2 flex items-center gap-2 px-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                <Languages className="h-3.5 w-3.5" />
                {t.nav.language}
              </div>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as typeof language)}
              >
                <SelectTrigger className="h-10 border-white/10 bg-transparent text-sm text-white shadow-none focus:ring-0">
                  <SelectValue placeholder={t.nav.language} />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#101826]/95 text-white backdrop-blur-xl">
                  {languages.map((item) => (
                    <SelectItem key={item.code} value={item.code} className="focus:bg-white/10">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nav links - Mobile */}
            {t.nav.links.map((l) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all"
                whileHover={{ x: 4 }}
              >
                {l.label}
              </motion.a>
            ))}

            {/* Call button - Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg"
              asChild
            >
              <a href="tel:+15551234567" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t.nav.call}
              </a>
            </Button>

            {/* Book button - Mobile */}
            <Button
              className="btn-premium w-full bg-gradient-primary hover:bg-gradient-primary text-primary-foreground rounded-lg font-semibold"
              asChild
            >
              <a href="#booking" onClick={() => setOpen(false)}>
                {t.nav.book}
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
