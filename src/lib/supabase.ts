
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase
const supabaseUrl = "https://xrrhccxdnszjgpicdbxa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmhjY3hkbnN6amdwaWNkYnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzI5OTEsImV4cCI6MjA2MDY0ODk5MX0.iFqB1vMhrASxysNq0NUJW_lZjTXfD-OkhwEMxxIyAp0";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
