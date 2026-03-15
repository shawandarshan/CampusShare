import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ─── Anon client (public, read-only safe) ────────────────────────────────────
// Safe lazy initialization — does not throw at build time
let _supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient {
    if (_supabase) return _supabase;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables."
        );
    }

    _supabase = createClient(supabaseUrl, supabaseAnonKey);
    return _supabase;
}

/** Anon-key client — use only for non-privileged, public reads. */
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getClient() as any)[prop];
    },
});

// ─── Admin client (service-role key, SERVER ONLY) ─────────────────────────────
// Bypasses Row Level Security — NEVER import this in client components.
let _supabaseAdmin: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient {
    if (_supabaseAdmin) return _supabaseAdmin;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error(
            "Missing Supabase service-role key. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables."
        );
    }

    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
    return _supabaseAdmin;
}

/** Service-role client — use ONLY in server-side API routes. Bypasses RLS. */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getAdminClient() as any)[prop];
    },
});
