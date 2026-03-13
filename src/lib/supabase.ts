import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safe lazy initialization — does not throw at build time
// Throws only at runtime when a request actually uses Supabase
let _supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient {
    if (_supabase) return _supabase;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.");
    }

    _supabase = createClient(supabaseUrl, supabaseKey);
    return _supabase;
}

// Named export used everywhere in the codebase
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getClient() as any)[prop];
    },
});
