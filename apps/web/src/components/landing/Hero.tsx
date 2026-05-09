import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, MessageCircle, Shield, Star, Sparkles, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-dental.jpg";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { t } = useI18n();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden bg-hero pb-32 pt-40 md:pb-40 md:pt-48">
      {/* Animated gradient orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="hero-gradient-orb hero-orb-primary float-slow"
          style={{
            top: "-200px",
            right: "-100px",
          }}
          animate={{
            y: mousePos.y * 0.05,
            x: mousePos.x * 0.05,
          }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        />
        <motion.div
          className="hero-gradient-orb hero-orb-gold float-medium"
          style={{
            bottom: "0",
            left: "-150px",
          }}
        />
        <motion.div
          className="hero-gradient-orb hero-orb-accent float-slow"
          style={{
            top: "50%",
            right: "5%",
          }}
          animate={{
            y: -mousePos.y * 0.03,
            x: -mousePos.x * 0.03,
          }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

      {/* Subtle top divider line */}
      <div className="absolute inset-x-0 top-32 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]"
        >
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="luxury-outline inline-flex items-center gap-2.5 rounded-full glass px-4 py-2.5 text-xs font-medium text-white/95 cursor-pointer"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </motion.div>
                {t.hero.badge}
              </motion.div>
            </motion.div>

            {/* Main headline */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="display-lg text-white leading-[1.05]">
                {t.hero.title.before}{" "}
                <span className="text-gradient relative inline-block">
                  {t.hero.title.highlight}
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                  >
                    <path
                      d="M 0 4 Q 25 0, 50 4 T 100 4"
                      stroke="url(#gradient)"
                      strokeWidth="1.5"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="oklch(0.78 0.11 198)" />
                        <stop offset="100%" stopColor="oklch(0.56 0.09 224)" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>{" "}
                {t.hero.title.after}
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="max-w-xl text-lg leading-8 text-foreground/75"
            >
              {t.hero.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button
                size="lg"
                className="btn-premium h-13 px-8 text-base font-semibold bg-gradient-primary hover:bg-gradient-primary text-primary-foreground rounded-xl"
                asChild
              >
                <a href="#booking" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t.hero.primaryCta}
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="btn-premium h-13 px-8 text-base font-semibold border border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                asChild
              >
                <a href="#chat" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t.hero.secondaryCta}
                </a>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
                      >
                        <Star className="w-4 h-4 fill-gold text-gold" />
                      </motion.div>
                    ))}
                  </div>
                  <span className="font-semibold text-white">4.9</span>
                  <span className="text-muted-foreground">{t.hero.ratingSuffix}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8">
                  <Shield className="w-4 h-4 text-primary" />
                  {t.hero.certifications[0]}
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {t.hero.certifications[1]}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Hero image with floating elements */}
          <motion.div
            variants={itemVariants}
            className="relative h-full"
          >
            {/* Main image card */}
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="luxury-outline premium-panel relative aspect-[4/5] overflow-hidden rounded-3xl shadow-elegant"
              >
                <img
                  src={heroImg}
                  alt="Patient with bright healthy smile"
                  className="h-full w-full object-cover"
                  width={1024}
                  height={1280}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                {/* Top info pills */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                  className="absolute inset-x-6 top-6 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-xs uppercase tracking-widest text-white/70 backdrop-blur-xl"
                >
                  <span>{t.hero.topPills[0]}</span>
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>{t.hero.topPills[1]}</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Floating AI Chat Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, x: -30 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              whileHover={{ y: -4 }}
              className="luxury-outline absolute -bottom-8 -left-8 w-72 rounded-2xl glass p-5 shadow-elegant md:-bottom-12 md:-left-12"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                  className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
                >
                  <Bot className="h-5 w-5" />
                </motion.div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{t.floating.aiTitle}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <motion.span
                      animate={{ backgroundColor: ["#22c55e", "#16a34a"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-green-500"
                    />
                    {t.floating.aiStatus}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                  className="max-w-xs rounded-2xl rounded-tl-lg bg-secondary px-4 py-3 text-sm leading-relaxed text-white/90"
                >
                  {t.hero.chatGreeting}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="ml-auto max-w-xs rounded-2xl rounded-tr-lg bg-gradient-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground"
                >
                  {t.hero.chatReply}
                </motion.div>
              </div>
            </motion.div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              whileHover={{ y: -4 }}
              className="luxury-outline absolute top-16 -right-6 rounded-2xl glass p-5 shadow-elegant md:-right-12"
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {t.hero.statLabel}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 1.4, type: "spring" }}
                className="mt-2 text-3xl font-display font-bold text-gradient"
              >
                47<span className="text-lg">sec</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
