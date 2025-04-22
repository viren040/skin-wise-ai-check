
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for file storage operations
export const supabaseStorage = createClient(
  "https://xrrhccxdnszjgpicdbxa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmhjY3hkbnN6amdwaWNkYnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzI5OTEsImV4cCI6MjA2MDY0ODk5MX0.iFqB1vMhrASxysNq0NUJW_lZjTXfD-OkhwEMxxIyAp0"
);

// Function to ensure the skin-analysis bucket exists
export const ensureSkinAnalysisBucketExists = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseStorage.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'skin-analysis');
    
    if (!bucketExists) {
      console.log('Creating skin-analysis bucket...');
      const { error: createError } = await supabaseStorage.storage.createBucket('skin-analysis', {
        public: true, // Make bucket public so we can access files
        fileSizeLimit: 10485760, // 10MB limit
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      console.log('Bucket created successfully');
    } else {
      console.log('Bucket already exists');
    }
    
    // Add policy to allow public access to files if bucket exists
    if (bucketExists) {
      // This will be handled by RLS policies at the database level
      console.log('Ensuring bucket is public');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return false;
  }
};
