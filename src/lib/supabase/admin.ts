import { createClient } from '@supabase/supabase-js'
import { Database } from '@/db/types'

// Admin client bypasses RLS and should ONLY be used in server actions or route handlers
// NEVER expose this to the browser/client side.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
