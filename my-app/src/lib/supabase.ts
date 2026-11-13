/**
 * Flow: import createClient component -> get values from .env ->
 *       create supabase client component 
 */

import { createClient } from "@supabase/supabase-js";

//Read value from .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

//If they are missing (prevents confusing errors)
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase values. Check .env.local file.");
}

//The shared client 
export const supabase = createClient(supabaseUrl, supabaseKey);