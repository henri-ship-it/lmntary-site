/**
 * Supabase client helpers — re-exports for server-side code.
 *
 * Client components should import directly from '@/lib/supabase-browser'.
 * Server components/actions import from here or from the individual files.
 */

export { createServerComponentClient } from './supabase-server';
export { createAdminClient } from './supabase-admin';
