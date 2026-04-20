import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware that refreshes Supabase auth tokens on every request.
 * Also protects paid lesson routes — redirects to sign-in if no session.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session (important — keeps tokens alive)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect paid lesson routes: /learn/limitless/* (except the course overview)
  // The course overview at /learn/limitless is public; individual lessons are gated.
  const pathname = request.nextUrl.pathname;
  const isProtectedLesson =
    pathname.match(/^\/learn\/limitless\/.+/) && !pathname.endsWith('/sign-in');

  if (isProtectedLesson && !user) {
    const signInUrl = new URL('/learn/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on all routes except static files and images
    '/((?!_next/static|_next/image|favicon.ico|logos|team|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
