import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE!;

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export default supabase;
