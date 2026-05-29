import { createClient } from '@supabase/supabase-js'

/**
 * @fileOverview Build-safe Supabase client initialization.
 * Prevents build-time crashes if environment variables are missing
 * during the static analysis phase of deployment.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
