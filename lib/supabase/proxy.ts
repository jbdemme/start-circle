import { createServerClient } from "@supabase/ssr";
import next from "next";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/about", "/legal", "/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  const nextUrl = request.nextUrl.clone();
  const nextSitePublic = PUBLIC_PATHS.includes(nextUrl.pathname);

  if (!user && !nextSitePublic) {
    // no user and next site not public
    // => redirect the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based routing for users on private routes
  if (user && !nextSitePublic) {
    // Check app_metadata for role and status of user
    if (
      !user.app_metadata ||
      !user.app_metadata.role ||
      !user.app_metadata.status
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/error?message=User%20role%20not%20found.";
      return NextResponse.redirect(url);
    }

    const role = user.app_metadata.role;
    const status = user.app_metadata.status;

    // Redirect wrong routes to the main dashboard for the role
    if (!request.nextUrl.pathname.startsWith(`/${role}`)) {
      const url = request.nextUrl.clone();

      console.log(
        `Redirecting user with role ${role} from ${request.nextUrl.pathname} to their dashboard at /${role}`,
      );
      url.pathname = `/${role}`;
      return NextResponse.redirect(url);
    }

    // Redirect them based on non-accepted status
    if (status === "in_review" && nextUrl.pathname !== `/${role}/in-review`) {
      nextUrl.pathname = `/${role}/in-review`;
      return NextResponse.redirect(nextUrl);
    } else if (
      status === "rejected" &&
      nextUrl.pathname !== `/${role}/rejected`
    ) {
      nextUrl.pathname = `/${role}/rejected`;
      return NextResponse.redirect(nextUrl);
    }

    // Redirect non-accepted users to a waiting page (except for settings/auth routes)
    // Uncomment and adjust this block when you have a waiting/pending page:
    // if (
    //   status !== "accepted" &&
    //   !request.nextUrl.pathname.startsWith("/pending") &&
    //   !request.nextUrl.pathname.startsWith("/auth")
    // ) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = "/pending";
    //   return NextResponse.redirect(url);
    // }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
