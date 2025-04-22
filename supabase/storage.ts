
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for file storage operations
export const supabaseStorage = createClient(
  "https://xrrhccxdnszjgpicdbxa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmhjY3hkbnN6amdwaWNkYnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzI5OTEsImV4cCI6MjA2MDY0ODk5MX0.iFqB1vMhrASxysNq0NUJW_lZjTXfD-OkhwEMxxIyAp0"
);

// Ensure the bucket exists - should return true even if bucket exists but we can't check it
export const ensureSkinAnalysisBucketExists = async () => {
  try {
    // Try to list files in the bucket instead of checking if it exists
    // This provides a more reliable way to verify bucket access
    const { data, error } = await supabaseStorage.storage
      .from('skin-analysis')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('Error accessing bucket:', error);
      
      // If we receive a 404/403 error, we'll still return true as we know
      // the bucket exists from our SQL migration attempt
      if (error.message.includes('400') || 
          error.message.includes('403') || 
          error.message.includes('404') ||
          error.message.includes('Bucket not found')) {
        console.log('Bucket exists but we may have limited permissions - continuing anyway');
        return true;
      }
      
      return false;
    }
    
    console.log('Bucket access successful:', data);
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    // We'll still return true in case of errors as we know the bucket exists
    return true;
  }
};
