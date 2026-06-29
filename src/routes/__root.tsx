import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Bell, Command, Sparkles, Moon, Sun, LogOut, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAlerts } from "@/components/alert-center";
import { Badge } from "@/components/ui/badge";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { loadBackendData, useTheme } from "../lib/store";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/command-palette";
import { OneShotOrderDialog } from "@/components/one-shot-order";
import { logout } from "@/lib/api/clients";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Please try again."}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-semibold text-primary">404</p>
      <p className="mt-2 text-sm text-muted-foreground">This module is not on the route map.</p>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Honey Enterprises ERP" },
      { name: "description", content: "Stone crusher, aggregate trading and transport ERP for Honey Enterprises." },
      { name: "theme-color", content: "#0f172a" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Honey ERP" },
      { name: "mobile-web-app-capable", content: "yes" },
      { property: "og:title", content: "Honey Enterprises ERP" },
      { name: "twitter:title", content: "Honey Enterprises ERP" },
      { property: "og:description", content: "Stone crusher, aggregate trading and transport ERP for Honey Enterprises." },
      { name: "twitter:description", content: "Stone crusher, aggregate trading and transport ERP for Honey Enterprises." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3948ac91-0ca4-4ca1-9b03-9a00f1f7101b/id-preview-ec519bab--ba14a1a2-2524-45d2-be8c-aaeaeb3d1806.lovable.app-1780409184473.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3948ac91-0ca4-4ca1-9b03-9a00f1f7101b/id-preview-ec519bab--ba14a1a2-2524-45d2-be8c-aaeaeb3d1806.lovable.app-1780409184473.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
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

const sevIcon = { critical: ShieldAlert, warning: AlertTriangle, info: Info } as const;
const sevClass = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  info: "bg-info/15 text-info border-info/30",
} as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();
  const [oneShot, setOneShot] = useState(false);
  const { theme, toggleTheme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const alerts = useAlerts();

  // Check if we're on the login page
  const isLoginPage = router.state.location.pathname === "/login";

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");

    if (!token && !isLoginPage) {
      navigate({ to: "/login" });
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, [navigate, isLoginPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        window.print();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    loadBackendData().catch((error) => {
      console.warn("Unable to load backend ERP data:", error);
    });
  }, []);

  useEffect(() => {
    // Initialize theme on mount
    setTheme(theme);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate({ to: "/login" });
  };

  // If on login page, just render the outlet without sidebar
  if (isLoginPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen w-full">
          <Outlet />
        </div>
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
              <SidebarTrigger />
              <button
                onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
                className="hidden h-9 max-w-md flex-1 items-center gap-2 rounded-md border border-border bg-card px-3 text-left text-xs text-muted-foreground transition hover:border-primary/50 md:flex"
              >
                <Command className="h-3.5 w-3.5" />
                <span>Quick search & jump…</span>
                <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
              </button>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => setOneShot(true)}>
                  <Sparkles className="mr-1 h-3.5 w-3.5" />One-Shot
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                      <Bell className="h-4 w-4" />
                      {alerts.length > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
                          {alerts.length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                      <h3 className="font-display text-sm font-semibold">Smart alerts</h3>
                      <Badge variant="outline" className="text-[10px]">{alerts.length}</Badge>
                    </div>
                    <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                      {alerts.length === 0 ? (
                        <li className="px-4 py-6 text-center text-xs text-muted-foreground">All clear — nothing needs attention.</li>
                      ) : (
                        alerts.map((a) => {
                          const Icon = sevIcon[a.severity] || Info;
                          const inner = (
                            <div className="flex items-start gap-3 px-4 py-2.5 transition hover:bg-muted/30">
                              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${sevClass[a.severity]}`}>
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-foreground">{a.title}</p>
                                <p className="text-[10px] text-muted-foreground">{a.category} • {a.detail}</p>
                              </div>
                            </div>
                          );
                          return (
                            <li key={a.id}>
                              {a.href ? (
                                <Link to={a.href} className="block">
                                  {inner}
                                </Link>
                              ) : inner}
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle theme"
                  onClick={toggleTheme}
                  title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Logout"
                  onClick={handleLogout}
                  title="Logout"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {user?.username?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="hidden text-left leading-tight sm:block">
                    <p className="text-xs font-medium text-foreground">{user?.username || "Admin"}</p>
                    <p className="text-[10px] text-muted-foreground">{user?.role || "Administrator"}</p>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
        </div>
        <CommandPalette onCreate={() => setOneShot(true)} />
        <OneShotOrderDialog open={oneShot} onOpenChange={setOneShot} />
        <Toaster richColors position="top-right" />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
