import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity, Bell, ChevronDown, CircleHelp, CreditCard, Gauge, Lightbulb, LogOut,
  Menu, Plus, Route as RouteIcon, Search, Settings, ShieldAlert, Sparkles, UserRound, X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { displayNameFor, initialsFor, useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: Gauge },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/risk-center", label: "Risk Center", icon: ShieldAlert },
  { to: "/route-intelligence", label: "Route Intelligence", icon: RouteIcon },
  { to: "/monitoring", label: "Monitoring", icon: Activity },
  { to: "/insights", label: "Insights", icon: Lightbulb },
] as const;

const bottomNav = nav.slice(0, 5);

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="FinSight AI home">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary shadow-[0_0_24px_var(--accent-glow)]">
        <Sparkles className="size-4" />
      </span>
      {!compact && <span className="min-w-0"><span className="block text-[15px] font-semibold text-foreground">FinSight <span className="text-primary">AI</span></span><span className="block truncate text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Payment intelligence</span></span>}
    </Link>
  );
}

function SideLink({ item, pathname, onClick }: { item: (typeof nav)[number]; pathname: string; onClick?: () => void }) {
  const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
  const Icon = item.icon;
  return <Link to={item.to} onClick={onClick} className={cn("group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors", active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground")}>
    {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />}
    <Icon className={cn("size-4", active && "text-primary")} />
    <span>{item.label}</span>
  </Link>;
}

function AccountMenu({ variant }: { variant: "sidebar" | "header" }) {
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const name = displayNameFor(profile, user);
  const initials = initialsFor(name) || "FS";
  const subtitle = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Member";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "sidebar" ? (
          <button className="mt-2 grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-2.5 text-left transition-colors hover:bg-accent/60">
            <span className="grid size-8 place-items-center rounded-md bg-secondary text-xs font-semibold">{initials}</span>
            <span className="min-w-0"><span className="block truncate text-xs font-medium">{name}</span><span className="block truncate text-[10px] text-muted-foreground">{subtitle}</span></span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        ) : (
          <button className="hidden items-center gap-3 rounded-lg border border-border bg-card px-3 py-1.5 text-left transition-colors hover:bg-accent/60 sm:flex">
            <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">{initials}</span>
            <span><span className="block max-w-[9rem] truncate text-xs font-medium">{profile?.company ?? name}</span><span className="block text-[9px] text-muted-foreground">{subtitle}</span></span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="grid gap-0.5">
          <span className="truncate text-sm">{name}</span>
          <span className="truncate text-[11px] font-normal text-muted-foreground">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/settings"><UserRound className="size-4" /> Profile & settings</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/help"><CircleHelp className="size-4" /> Help centre</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            await signOut();
            void navigate({ to: "/auth" });
          }}
        >
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="grid size-11 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_28px_var(--accent-glow)]">
            <Sparkles className="size-4" />
          </span>
          <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-1/2 rounded-full bg-primary animate-progress" />
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export function AppShell({ children, title, eyebrow }: { children: ReactNode; title: string; eyebrow?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  return <AuthGate><div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border bg-sidebar lg:flex lg:flex-col">
      <div className="flex h-20 items-center px-5"><Brand /></div>
      <nav className="flex-1 space-y-1 px-3">{nav.map((item) => <SideLink key={item.to} item={item} pathname={pathname} />)}</nav>
      <div className="space-y-1 border-t border-border p-3">
        <Link to="/settings" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><Settings className="size-4" />Settings</Link>
        <Link to="/help" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><CircleHelp className="size-4" />Help</Link>
        <AccountMenu variant="sidebar" />
      </div>
    </aside>

    {open && <div className="fixed inset-0 z-50 bg-overlay lg:hidden" onClick={() => setOpen(false)}><aside className="h-full w-72 border-r border-border bg-sidebar p-4" onClick={(e) => e.stopPropagation()}><div className="mb-8 flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu"><X /></Button></div><nav className="space-y-1">{nav.map((item) => <SideLink key={item.to} item={item} pathname={pathname} onClick={() => setOpen(false)} />)}</nav><div className="mt-6 border-t border-border pt-3"><AccountMenu variant="sidebar" /></div></aside></div>}

    <div className="min-w-0 lg:pl-60">
      <header className="sticky top-0 z-30 grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></Button><div className="min-w-0"><p className="truncate text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{eyebrow ?? profile?.company ?? "Acme Technologies"}</p><h1 className="truncate text-sm font-semibold sm:text-base">{title}</h1></div></div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative hidden md:block"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input className="h-9 w-56 bg-card pl-9" placeholder="Search payments..." /></div>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications"><Bell /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-risk-high" /></Button>
          <AccountMenu variant="header" />
        </div>
      </header>
      <main className="mx-auto max-w-[1560px] px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-sidebar/95 px-1 py-1.5 backdrop-blur-xl lg:hidden">
      {bottomNav.map((item) => { const Icon = item.icon; const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to); return <Link key={item.to} to={item.to} className={cn("flex min-w-0 flex-col items-center gap-1 rounded-md py-1.5 text-[9px]", active ? "text-primary" : "text-muted-foreground")}><Icon className="size-4"/><span className="truncate">{item.label.replace("Route Intelligence", "Routes").replace("Risk Center", "Risk")}</span></Link>; })}
    </nav>
  </div></AuthGate>;
}

export function PageIntro({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><h2 className="text-2xl font-semibold sm:text-[28px]">{title}</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</div>;
}

export function NewPaymentButton() { return <Button asChild><Link to="/new-payment"><Plus /> <span className="hidden sm:inline">New Payment</span></Link></Button>; }
