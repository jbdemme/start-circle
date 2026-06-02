import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

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

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const { appStatus, appRole } = session.user as {
    appStatus?: string;
    appRole?: string;
  };

  const redirect = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  if (appStatus === "new" && pathname !== "/choose-role") {
    return redirect("/choose-role");
  }
  if (
    appStatus === "application" &&
    !pathname.startsWith(`/application/${appRole}`)
  ) {
    return redirect(`/application/${appRole}`);
  }
  if (
    appStatus === "in_review" &&
    !pathname.startsWith(`/review/${appRole}`)
  ) {
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
