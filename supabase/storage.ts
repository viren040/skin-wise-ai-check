
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for file storage operations
export const supabaseStorage = createClient(
  "https://xrrhccxdnszjgpicdbxa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmhjY3hkbnN6amdwaWNkYnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzI5OTEsImV4cCI6MjA2MDY0ODk5MX0.iFqB1vMhrASxysNq0NUJW_lZjTXfD-OkhwEMxxIyAp0"
);

// Now that we've created the bucket via SQL, this function is simpler
export const ensureSkinAnalysisBucketExists = async () => {
  try {
    // Just check if bucket exists
    const { data, error } = await supabaseStorage.storage.getBucket('skin-analysis');
    
    if (error) {
      console.error('Error checking if bucket exists:', error);
      return false;
    }
    
    console.log('Bucket exists:', data);
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return false;
  }
};
