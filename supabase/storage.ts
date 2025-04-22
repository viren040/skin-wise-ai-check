
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for file storage operations
export const supabaseStorage = createClient(
  "https://xrrhccxdnszjgpicdbxa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmhjY3hkbnN6amdwaWNkYnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzI5OTEsImV4cCI6MjA2MDY0ODk5MX0.iFqB1vMhrASxysNq0NUJW_lZjTXfD-OkhwEMxxIyAp0"
);
