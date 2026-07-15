import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import logoAsset from "../assets/hirenest-logo-mark.png.asset.json";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navigation } from "../components/site/Navigation";
import { Footer } from "../components/site/Footer";
import { LoadingScreen } from "../components/site/LoadingScreen";
import { SmoothScroll } from "../components/site/SmoothScroll";
import { ScrollProgress } from "../components/site/ScrollProgress";
import { CursorGlow } from "../components/site/CursorGlow";
import { CursorDot } from "../components/site/CursorDot";
import { PageTransition } from "../components/site/PageTransition";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center hero-bg px-4">
      <div className="max-w-md text-center glass-strong rounded-2xl p-10">
        <h1 className="text-7xl font-display text-gold">404</h1>
        <h2 className="mt-4 text-xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <a href="/" className="mt-6 inline-flex items-center justify-center rounded-full btn-royal px-6 py-2.5 text-sm font-medium">
          Return Home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center hero-bg px-4">
      <div className="max-w-md text-center glass-strong rounded-2xl p-10">
        <h1 className="text-2xl font-display text-gold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try refreshing.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full btn-royal px-6 py-2.5 text-sm font-medium"
          >
            Try again
          </button>
          <a href="/" className="rounded-full btn-ghost-glass px-6 py-2.5 text-sm font-medium">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HireNest Global — Connecting Global Talent with World-Class Companies" },
      { name: "description", content: "Premium international recruitment, executive search, contract staffing, C2C, payroll, and global hiring across USA, UK, Germany, UAE, Canada, and Australia." },
      { name: "author", content: "HireNest Global" },
      { property: "og:title", content: "HireNest Global — Premium International Recruitment" },
      { property: "og:description", content: "Connecting world-class companies with elite global talent across seven continents." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: logoAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: logoAsset.url },
    ],
   links: [
      { rel: "icon", type: "image/png", href: logoAsset.url },
      { rel: "apple-touch-icon", href: logoAsset.url },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,0..100&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
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
      <LoadingScreen />
      <SmoothScroll />
      <ScrollProgress />
      <CursorGlow />
      <CursorDot />
      <Navigation />
      <PageTransition>
        <Outlet />
      </PageTransition>
      <Footer />
    </QueryClientProvider>
  );
}
