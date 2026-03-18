import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Role } from "./lib/schema";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/about",
  "/learn_more",
  "/getting-started",
  "/legal_notice",
  "/privacy_policy",
]);

const inviteCodes = ["abc123", "def456", "ghi789"];

const signupRoute = createRouteMatcher(["/signup"]);

const ONBOARDING_POLICIES = {
  new: {
    isAllowed: createRouteMatcher(["/choose-role(.*)"]),
    redirectTo: () => "/choose-role",
  },
  application: {
    // Notice we allow both the application flow AND the role choice (if they want to go back)
    // TODO: Prevent the user from visiting application/wrong-role
    isAllowed: createRouteMatcher(["/application(.*)", "/choose-role(.*)"]),
    redirectTo: (role: string | undefined) => `/application/${role}`,
  },
  in_review: {
    isAllowed: createRouteMatcher(["/review(.*)"]),
    redirectTo: (role: string | undefined) => {
      return `/review/${role}`;
    },
  },
  rejected: {
    isAllowed: createRouteMatcher(["/rejected(.*)"]),
    redirectTo: (role: string | undefined) => `/rejected/${role}`,
  },
};

export function enforceOnboardingRoute(
  req: NextRequest,
  status: Exclude<ApplicationStatus, "accepted"> | undefined,
  role: Role | undefined,
) {
  const policy = ONBOARDING_POLICIES[status || "new"];

  if (!policy.isAllowed(req)) {
    const url = new URL(policy.redirectTo(role), req.url);
    return NextResponse.redirect(url);
  } else {
    return NextResponse.next();
  }
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth();

  // Public check: Is route public? => go through
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (signupRoute(req)) {
    const { searchParams } = req.nextUrl;
    const inviteCode = searchParams.get("code");

    if (inviteCode && inviteCodes.includes(inviteCode)) {
      return NextResponse.next();
    } else {
      console.log("Wrong invite code");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Auth Check: Is user authenticated? => redirect to sign in
  if (!isAuthenticated) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Accepted check: is the user accepted?
  const status = sessionClaims?.app_status as ApplicationStatus | undefined;
  const role = sessionClaims?.app_role as Role | undefined;
  if (status !== "accepted") {
    // see onboarding policies above
    return enforceOnboardingRoute(req, status, role);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
