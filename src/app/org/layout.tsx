import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import OrgShell from "@/components/org/OrgShell";

export default async function OrgLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Verify organizer role server-side
  const supabase = createServerSupabaseClient();
  const { data: user } = await supabase
    .from("users")
    .select("role, onboarding_complete")
    .eq("clerk_id", userId)
    .single();

  // Not onboarded yet
  if (!user || !user.onboarding_complete) redirect("/onboarding");

  // Wrong role — send volunteers to their dashboard
  if (user.role !== "organizer") redirect("/dashboard");

  return <OrgShell>{children}</OrgShell>;
}
