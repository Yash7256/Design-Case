import { createBrowserClient, createServerClient } from '@supabase/ssr';

/**
 * Supabase browser client for client-side operations
 * Use this in Client Components
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Supabase server client for server-side operations
 * Use this in Server Components and Route Handlers
 */
export function createServerComponentClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Dynamically import to avoid issues in build
          const { cookies } = require('next/headers');
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          try {
            const { cookies } = require('next/headers');
            const cookieStore = cookies();
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Ignore errors (might be called during build)
          }
        },
      },
    }
  );
}
