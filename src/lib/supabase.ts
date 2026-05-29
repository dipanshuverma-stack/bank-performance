import { createClient } from '@supabase/supabase-js'

/**
 * @fileOverview Build-safe Supabase client initialization.
 * Prevents build-time crashes if environment variables are missing
 * during the static analysis phase of deployment.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ahdpdkcwccbgoujukvzv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZHBka2N3Y2NiZ291anVrdnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNDUwNzYsImV4cCI6MjA5NTYyMTA3Nn0.-U7CqPigUbkngAilZP3GCugLKUio9ZTuBeNVW0pRjhw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
