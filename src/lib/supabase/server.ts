import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient(
  cookieStore?: ReturnType<typeof cookies> | Awaited<ReturnType<typeof cookies>>
) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder-anon-key'

  const resolvedStore = cookieStore ? await cookieStore : await cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return resolvedStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            resolvedStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if session refresh middleware/proxy is in place.
        }
      },
    },
  })
}
