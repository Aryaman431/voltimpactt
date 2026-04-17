import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/discover(.*)",
  "/events(.*)",
  "/rewards(.*)",
  "/badges(.*)",
  "/profile(.*)",
  "/community(.*)",
  "/leaderboard(.*)",
  "/ledger(.*)",
  "/onboarding(.*)",
  "/org(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtected(req)) auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)" ],
};
