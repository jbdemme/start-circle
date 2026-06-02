import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie, getCookieCache } from "better-auth/cookies";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/api/auth",
  "/learn_more",
  "/legal_notice",
  "/privacy_policy",
  "/waitlist",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // Edge-safe optimistic auth check — does NOT import the full `auth`
  // instance (which pulls Node-only DB drivers into the Edge runtime).
  // Authoritative session validation still happens server-side via
  // `auth.api.getSession()` in Server Components / Server Actions.
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const redirect = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  // Onboarding-flow routing from the cached session (Edge-safe). When the
  // cookie cache is unavailable we let the request through; the server-side
  // session check enforces the flow authoritatively.
  const cached = await getCookieCache<{
    user: { appStatus?: string; appRole?: string };
  }>(request);
  const appStatus = cached?.user?.appStatus;
  const appRole = cached?.user?.appRole;

  if (!appStatus) return NextResponse.next();

  if (appStatus === "new" && pathname !== "/choose-role") {
    return redirect("/choose-role");
  }
  if (
    appStatus === "application" &&
    !pathname.startsWith(`/application/${appRole}`)
  ) {
    return redirect(`/application/${appRole}`);
  }
  if (appStatus === "in_review" && !pathname.startsWith(`/review/${appRole}`)) {
    return redirect(`/review/${appRole}`);
  }
  if (
    appStatus === "rejected" &&
    !pathname.startsWith(`/rejected/${appRole}`)
  ) {
    return redirect(`/rejected/${appRole}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
