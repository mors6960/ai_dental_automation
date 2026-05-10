import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, MessageCircle, Shield, Star, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-dental.jpg";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-hero pb-24 pt-32 md:pb-28 md:pt-40">
      <div className="absolute inset-0 grid-pattern opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="luxury-outline inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {t.hero.badge}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.98] text-slate-950 md:text-6xl lg:text-7xl"
          >
            {t.hero.title.before} <span className="text-gradient">{t.hero.title.highlight}</span> {t.hero.title.after}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground"
          >
            {t.hero.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button size="lg" className="h-12 px-6" asChild>
              <a href="#booking"><Calendar className="w-4 h-4 mr-2" /> {t.hero.primaryCta}</a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 bg-white/4" asChild>
              <a href="#chat"><MessageCircle className="w-4 h-4 mr-2" /> {t.hero.secondaryCta}</a>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
              <span className="ml-1 font-medium text-foreground">4.9</span>
              <span>{t.hero.ratingSuffix}</span>
            </div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> {t.hero.certifications[0]}</div>
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> {t.hero.certifications[1]}</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="luxury-outline premium-panel relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <img src={heroImg} alt="Patient with bright healthy smile" className="w-full h-full object-cover" width={1024} height={1280} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent" />
            <div className="absolute inset-x-8 top-8 flex items-center justify-between rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-500 backdrop-blur-md">
              <span>{t.hero.topPills[0]}</span>
              <span>{t.hero.topPills[1]}</span>
            </div>
          </div>

          {/* Floating chatbot card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="luxury-outline absolute bottom-10 -left-4 w-[280px] rounded-2xl glass p-4 shadow-elegant md:-left-10"
          >
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-950">{t.floating.aiTitle}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-whatsapp animate-pulse" /> {t.floating.aiStatus}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2 text-slate-700">
                {t.hero.chatGreeting}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-primary px-3 py-2 text-primary-foreground"
              >
                {t.hero.chatReply}
              </motion.div>
            </div>
          </motion.div>

          {/* Floating stat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="luxury-outline absolute -right-2 top-10 rounded-2xl glass p-4 shadow-elegant md:-right-6"
          >
            <div className="text-xs text-muted-foreground">{t.hero.statLabel}</div>
            <div className="text-2xl font-display font-semibold text-gradient">47 sec</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
