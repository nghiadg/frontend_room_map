import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isProtectedRoute,
  hasRouteAccess,
  UserRole,
} from "@/constants/user-role";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if the route is protected
  if (isProtectedRoute(pathname)) {
    // User must be authenticated
    if (!user) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // TODO: [PERFORMANCE] Move role to Supabase JWT custom claims to avoid
    // fetching profile on every protected route. This will reduce latency
    // and database load. See: https://supabase.com/docs/guides/auth/jwts
    // Fetch user profile with role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role_id, roles(name)")
      .eq("user_id", user.id)
      .single();

    // Get role name from profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roleName = (profile?.roles as any)?.name as UserRole | undefined;

    // Check if user has access to this route
    if (!hasRouteAccess(pathname, roleName)) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
