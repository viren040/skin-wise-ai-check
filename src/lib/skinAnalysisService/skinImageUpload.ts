
import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';
import { ensureSkinAnalysisBucketExists } from '../../../supabase/storage';

export const uploadSkinImage = async (file: File, userId: string = 'anonymous'): Promise<string | null> => {
  try {
    console.log('Starting image upload process...', file.name, file.size, file.type);

    // Ensure the bucket exists
    const bucketExists = await ensureSkinAnalysisBucketExists();
    if (!bucketExists) {
      console.error('Failed to ensure bucket exists');
      throw new Error("Storage bucket not available. Please try again later.");
    }

    // Log for debugging
    console.log('Bucket exists, proceeding with upload');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `skin-images/${fileName}`;
    
    console.log('Attempting to upload file:', filePath, 'Size:', file.size, 'Type:', file.type);
    
    // Upload the file with more explicit error handling
    const { data, error } = await supabase.storage
      .from('skin-analysis')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Changed to true to allow overwriting if path exists
        contentType: file.type
      });
    
    if (error) {
      console.error('Error uploading image:', error.message, error);

      // More specific error handling
      if (error.message.includes('JWT') || error.message.includes('token')) {
        throw new Error("Authentication error. Please refresh the page and try again.");
      } else if (error.message.includes('apikey')) {
        throw new Error("API key error. This might be a configuration issue.");
      } else if (file.size > 5 * 1024 * 1024 || error.message.includes('413')) {
        throw new Error("File is too large. Please upload a smaller image (under 5MB).");
      } else if (error.message.includes('timeout') || error.message.includes('network')) {
        throw new Error("Network timeout. Please check your connection and try again.");
      } else {
        throw new Error(`Upload error: ${error.message}`);
      }
    }
    
    if (!data || !data.path) {
      console.error('Upload was successful but no path was returned');
      throw new Error("Unknown upload error. The server did not return a valid file path.");
    }
    
    console.log('Upload successful, getting public URL for path:', data.path);
    
    // Get public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('skin-analysis')
      .getPublicUrl(data.path);
    
    if (!urlData || !urlData.publicUrl) {
      console.error('Failed to generate public URL');
      throw new Error("Failed to generate public URL for uploaded image.");
    }
    
    console.log('Generated public URL:', urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadSkinImage:', error);
    throw error; // Re-throw to allow the UI to handle it
  }
};
