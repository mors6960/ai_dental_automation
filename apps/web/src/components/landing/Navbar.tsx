import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, Languages } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          className={`luxury-outline flex items-center justify-between rounded-[1.4rem] px-4 py-3.5 md:px-6 transition-all ${
            scrolled
              ? "glass shadow-elegant"
              : "border border-white/0 bg-transparent"
          }`}
        >
          <a href="#" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-slate-950">
              Lumière<span className="text-gradient-gold"> Dental</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {t.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-slate-950"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-2 py-1">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
                <SelectTrigger className="h-8 min-w-[130px] border-0 bg-transparent px-2 text-xs text-slate-700 shadow-none focus:ring-0">
                  <SelectValue placeholder={t.nav.language} />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white text-slate-700 backdrop-blur-xl">
                  {languages.map((item) => (
                    <SelectItem key={item.code} value={item.code} className="focus:bg-slate-100 focus:text-slate-950">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-slate-950" asChild>
              <a href="tel:+15551234567">{t.nav.call}</a>
            </Button>
            <Button size="sm" className="shadow-glow" asChild>
              <a href="#booking">{t.nav.book}</a>
            </Button>
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="luxury-outline mt-2 flex flex-col gap-3 rounded-[1.4rem] glass p-4 md:hidden"
          >
            <div className="mb-2 rounded-xl border border-slate-200 bg-white/70 p-2">
              <div className="mb-1 flex items-center gap-2 px-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Languages className="h-3.5 w-3.5" />
                {t.nav.language}
              </div>
              <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
                <SelectTrigger className="h-10 border-slate-200 bg-transparent text-sm text-slate-700 shadow-none focus:ring-0">
                  <SelectValue placeholder={t.nav.language} />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white text-slate-700 backdrop-blur-xl">
                  {languages.map((item) => (
                    <SelectItem key={item.code} value={item.code} className="focus:bg-slate-100 focus:text-slate-950">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {t.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-1 text-sm text-muted-foreground transition-colors hover:text-slate-950"
              >
                {l.label}
              </a>
            ))}
            <Button asChild>
              <a href="#booking" onClick={() => setOpen(false)}>{t.nav.book}</a>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
