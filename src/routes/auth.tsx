import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout, GoogleMark } from "@/components/finsight/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — FinSight AI" },
      {
        name: "description",
        content: "Sign in or create your FinSight AI account to monitor payment risk, routes, and anomalies.",
      },
      { property: "og:title", content: "Sign in to FinSight AI" },
      { property: "og:description", content: "Access your payment intelligence workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

const copy: Record<Mode, { eyebrow: string; title: string; description: string }> = {
  signin: {
    eyebrow: "Welcome back",
    title: "Sign in to FinSight",
    description: "Pick up where you left off — pending reviews, risk alerts, and routing savings.",
  },
  signup: {
    eyebrow: "Create account",
    title: "Start controlling payment risk",
    description: "Set up your workspace in under a minute. No card required for the demo environment.",
  },
  forgot: {
    eyebrow: "Account recovery",
    title: "Reset your password",
    description: "We'll email you a secure link to choose a new password.",
  },
};

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="mb-7 grid grid-cols-2 gap-1 rounded-lg border border-border bg-card p-1">
      {(["signin", "signup"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            "h-9 rounded-md text-xs font-semibold transition-colors",
            mode === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === "signin" ? "Sign in" : "Create account"}
        </button>
      ))}
    </div>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<null | "confirm" | "reset">(null);

  useEffect(() => {
    if (!loading && user) void navigate({ to: "/" });
  }, [loading, user, navigate]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setSent(null);
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent("reset");
        toast.success("Reset link sent", { description: "Check your inbox for the password reset email." });
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name.trim(), company: company.trim() },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent("confirm");
          toast.success("Account created", { description: "Confirm your email to finish setting up." });
          return;
        }
        toast.success("Welcome to FinSight");
        void navigate({ to: "/" });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      toast.success("Signed in");
      void navigate({ to: "/" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(
        message.toLowerCase().includes("invalid login") ? "Email or password is incorrect" : message,
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed", { description: result.error.message });
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/" });
  }

  const text = copy[mode];

  if (sent) {
    return (
      <AuthLayout
        eyebrow="Check your email"
        title={sent === "confirm" ? "Confirm your email" : "Reset link sent"}
        description={
          sent === "confirm"
            ? `We sent a confirmation link to ${email}. Click it to activate your FinSight workspace.`
            : `We sent a password reset link to ${email}. The link expires in 60 minutes.`
        }
      >
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <Mail className="size-4" />
          </span>
          <p className="mt-4 text-sm text-muted-foreground">
            Nothing arrived? Check spam, or try a different email address.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => switchMode("signin")}>
            <ArrowLeft /> Back to sign in
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow={text.eyebrow} title={text.title} description={text.description}>
      {mode !== "forgot" && <ModeSwitch mode={mode} onChange={switchMode} />}

      {mode !== "forgot" && (
        <>
          <Button variant="outline" className="h-11 w-full gap-2.5" onClick={handleGoogle} disabled={busy}>
            <GoogleMark /> Continue with Google
          </Button>
          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <span className="h-px bg-border" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">or with email</span>
            <span className="h-px bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                className="h-11 bg-card"
                placeholder="Simra Begum"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                className="h-11 bg-card"
                placeholder="Acme Technologies"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            className="h-11 bg-card"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        {mode !== "forgot" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="h-11 bg-card pr-11"
                placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "signup" ? 8 : undefined}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        )}

        {mode === "signin" && (
          <label className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
            Keep me signed in on this device
          </label>
        )}

        <Button type="submit" className="h-11 w-full" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />}
          {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </Button>
      </form>

      {mode === "forgot" ? (
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to sign in
        </button>
      ) : (
        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          By continuing you agree to the FinSight demo terms.{" "}
          <Link to="/help" className="text-primary hover:underline">
            Need help?
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
