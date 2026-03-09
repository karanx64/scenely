import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// Admin client for backend (bypasses RLS - use service/secret key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Regular client for backend (respects RLS - use publishable key)
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
