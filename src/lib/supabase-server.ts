/**
 * Server-side Supabase client — uses cookies for session.
 * Only import this in server components, route handlers, and server actions.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerComponentClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Swallow in read-only contexts (server components)
          }
        },
      },
    }
  );
}
