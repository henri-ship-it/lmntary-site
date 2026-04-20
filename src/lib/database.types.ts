/**
 * Supabase database type definitions for LMNTARY Performance.
 *
 * Placeholder types — once the Supabase project is live, regenerate with:
 *   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
 *
 * For now we use a minimal definition that lets the client compile.
 * The `any` fallback ensures we don't fight the type system on tables
 * that haven't been introspected yet.
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Database {
  public: {
    Tables: Record<string, {
      Row: Record<string, unknown>;
      Insert: Record<string, unknown>;
      Update: Record<string, unknown>;
    }>;
  };
}
