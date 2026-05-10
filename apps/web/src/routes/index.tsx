import { createFileRoute } from "@tanstack/react-router";
import { LandingExperienceProvider } from "@/components/landing/landing-experience";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Trust } from "@/components/landing/Trust";
import { Services } from "@/components/landing/Services";
import { AIFeatures } from "@/components/landing/AIFeatures";
import { ChatDemo } from "@/components/landing/ChatDemo";
import { Booking } from "@/components/landing/Booking";
import { Workflow } from "@/components/landing/Workflow";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { FloatingActions } from "@/components/landing/FloatingActions";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <LandingExperienceProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute -left-32 top-[32rem] h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute right-0 top-[52rem] h-[32rem] w-[32rem] rounded-full bg-primary/8 blur-3xl" />
        </div>
        <Navbar />
        <main>
          <Hero />
          <Trust />
          <Services />
          <AIFeatures />
          <ChatDemo />
          <Booking />
          <Workflow />
          <Testimonials />
          <FAQ />
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </LandingExperienceProvider>
  );
}
