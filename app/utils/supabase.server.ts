import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  // get these from your Supabase project and add them to your .env file
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.PUBLIC_SUPABASE_ANON_KEY!
);

export default supabase;
