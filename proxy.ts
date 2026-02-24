import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in", "/sign-up"]);

const ONBOARDING_POLICIES = {
  new: {
    isAllowed: createRouteMatcher(["/choose-role(.*)"]),
    redirectTo: "/choose-role",
  },
  application: {
    // Notice we allow both the application flow AND the role choice (if they want to go back)
    isAllowed: createRouteMatcher(["/application(.*)", "/choose-role(.*)"]),
    redirectTo: "/application",
  },
  in_review: {
    isAllowed: createRouteMatcher(["/review(.*)"]),
    redirectTo: "/review",
  },
  rejected: {
    isAllowed: createRouteMatcher(["/rejected(.*)"]),
    redirectTo: "/rejected",
  },
};

type UserStatus = keyof typeof ONBOARDING_POLICIES;

export function enforceOnboardingRoute(
  req: NextRequest,
  status: string | undefined,
) {
  const policy = ONBOARDING_POLICIES[(status as UserStatus) || "new"];

  if (!policy.isAllowed(req)) {
    const url = new URL(policy.redirectTo, req.url);
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

  // Auth Check: Is user authenticated? => redirect to sign in
  if (!isAuthenticated) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Accepted check: is the user accepted?
  const status = sessionClaims?.status;
  if (status !== "accepted") {
    // see onboarding policies above
    return enforceOnboardingRoute(req, status);
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
