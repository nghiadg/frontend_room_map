import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isProtectedRoute,
  hasRouteAccess,
  UserRole,
} from "@/constants/user-role";

/**
 * Extract user_role from JWT custom claims.
 * Returns undefined if claims not available (fallback to DB query needed).
 */
function getRoleFromJwtClaims(
  user: { app_metadata?: Record<string, unknown> } | null
): UserRole | undefined {
  // Custom claims are added to app_metadata by Supabase Auth hooks
  // After setting up jwt_custom_claims.sql, user_role will be available here
  const role = user?.app_metadata?.user_role;
  if (typeof role === "string" && role) {
    return role as UserRole;
  }
  return undefined;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // PERFORMANCE OPTIMIZATION: Skip auth check for public routes
  // This reduces TTFB from ~1.5s to ~200ms for public pages
  if (!isProtectedRoute(pathname)) {
    return supabaseResponse;
  }

  // Only create Supabase client and check auth for protected routes
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

  // User must be authenticated for protected routes
  if (!user) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // PERFORMANCE: Try to get role from JWT custom claims first (no DB call)
  // After setting up jwt_custom_claims.sql hook, role will be in JWT
  let roleName = getRoleFromJwtClaims(user);

  // Fallback: If JWT claims not available, query database
  // This ensures backward compatibility during migration
  if (!roleName) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role_id, roles(name)")
      .eq("user_id", user.id)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roleName = (profile?.roles as any)?.name as UserRole | undefined;
  }

  // Check if user has access to this route
  if (!hasRouteAccess(pathname, roleName)) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
