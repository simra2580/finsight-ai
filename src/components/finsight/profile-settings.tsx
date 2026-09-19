import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, Settings2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { displayNameFor, initialsFor, useAuth } from "@/hooks/useAuth";
import { AppShell, PageIntro } from "./app-shell";
import { Panel, SectionHead } from "./shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsPage() {
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
    setCompany(profile?.company ?? "");
    setJobTitle(profile?.job_title ?? "");
  }, [profile]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName, company, job_title: jobTitle });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile updated");
  }

  const initials = initialsFor(displayNameFor(profile, user)) || "FS";

  return (
    <AppShell title="Settings">
      <PageIntro title="Settings" description="Manage your account, business preferences, and payment controls." />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel>
          <SectionHead title="Your profile" detail="Shown across reviews, approvals, and audit trails" />
          <form onSubmit={handleSave} className="space-y-5 p-5">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-base font-semibold text-primary">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user?.email}</p>
                <p className="mt-0.5 text-xs capitalize text-muted-foreground">{role ?? "member"} access</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input id="displayName" className="bg-card" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job title</Label>
                <Input id="jobTitle" className="bg-card" placeholder="Finance Admin" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" className="bg-card" placeholder="Acme Technologies" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                Save changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  await signOut();
                  void navigate({ to: "/auth" });
                }}
              >
                <LogOut /> Sign out
              </Button>
            </div>
          </form>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <SectionHead title="Security" detail="Keep your workspace protected" />
            <div className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-risk-low/10 text-risk-low">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Send yourself a secure link to choose a new password.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!user?.email) return;
                  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                  });
                  if (error) toast.error(error.message);
                  else toast.success("Reset link sent", { description: `Check ${user.email}.` });
                }}
              >
                Send password reset link
              </Button>
            </div>
          </Panel>

          <Panel>
            <SectionHead title="Business controls" detail="Approval thresholds and review rules" />
            <div className="flex items-start gap-3 p-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <Settings2 className="size-4" />
              </span>
              <p className="text-sm text-muted-foreground">
                Approval thresholds, routing rules, and notification preferences are simulated in this demo
                environment.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
