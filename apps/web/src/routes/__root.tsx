import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";

const siteUrl = "https://lumiere.dental";
const siteTitle = "Lumière Dental | AI-Powered Luxury Dental Clinic";
const siteDescription =
  "Lumière Dental helps patients book appointments instantly with an AI dental assistant, WhatsApp reminders, and premium cosmetic, restorative, and general dentistry.";
const siteKeywords =
  "luxury dental clinic, AI dental assistant, dental appointment booking, cosmetic dentistry, teeth whitening, dental implants, Invisalign, emergency dentist, WhatsApp reminders, premium dental care";
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Lumière Dental",
  url: siteUrl,
  description: siteDescription,
  telephone: "+1-555-123-4567",
  email: "hello@lumiere.dental",
  image: `${siteUrl}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "432 Park Ave",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10022",
    addressCountry: "US",
  },
  areaServed: "US",
  medicalSpecialty: [
    "Cosmetic Dentistry",
    "Dental Implants",
    "Invisalign",
    "General Dentistry",
    "Emergency Dentistry",
  ],
  openingHours: ["Mo-Fr 08:00-20:00", "Sa 09:00-17:00"],
};

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[20rem] w-[20rem] rounded-full bg-gold/10 blur-3xl" />
      </div>
      <div className="premium-panel luxury-outline relative w-full max-w-xl rounded-[2rem] p-8 text-center shadow-elegant md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-7 w-7" />
        </div>
        <div className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
          404 Error
        </div>
        <h1 className="mt-4 text-5xl font-semibold text-white md:text-6xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist anymore, or the link you opened is no longer valid.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[18rem] w-[18rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>
      <div className="premium-panel luxury-outline relative w-full max-w-2xl rounded-[2rem] p-8 text-center shadow-elegant md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/8 text-primary shadow-glow">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
          Runtime Error
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
          This page didn&apos;t load
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
          Something interrupted the page while it was loading. You can retry safely, or return to the homepage and continue browsing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/8"
          >
            <ArrowLeft className="h-4 w-4" />
            Go home
          </a>
        </div>
        {import.meta.env.DEV && error?.message ? (
          <div className="mt-8 rounded-2xl border border-white/8 bg-black/20 p-4 text-left">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Debug
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {error.message}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteTitle },
      { name: "description", content: siteDescription },
      { name: "keywords", content: siteKeywords },
      { name: "author", content: "Lumière Dental" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "theme-color", content: "#08111b" },
      { property: "og:title", content: siteTitle },
      { property: "og:description", content: siteDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:site_name", content: "Lumière Dental" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: `${siteUrl}/og-image.jpg` },
      { property: "og:image:alt", content: "Lumière Dental luxury AI-powered dental clinic" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: siteTitle },
      { name: "twitter:description", content: siteDescription },
      { name: "twitter:image", content: `${siteUrl}/og-image.jpg` },
      { name: "twitter:site", content: "@LumiereDental" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: siteUrl },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Outlet />
      </I18nProvider>
    </QueryClientProvider>
  );
}
