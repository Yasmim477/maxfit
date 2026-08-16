import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ewibqlguwibhyzkdjpac.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YQdsgpbN1T28wqzWMDe3pg_whlSG8Nv";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
