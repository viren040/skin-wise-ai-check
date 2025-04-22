
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import { ensureSkinAnalysisBucketExists } from '../../supabase/storage';

export interface SkinFormData {
  concernDescription?: string;
  duration?: string;
  recentChanges?: string;
  isPainful?: string;
  age?: string;
  skinType?: string;
  hasCondition?: string;
  additionalInfo?: string;
}

export interface SkinAnalysisResult {
  id: string;
  skinAge: number;
  skinType: string;
  hydrationLevel: string;
  skinTone?: string;
  uvSensitivity?: string;
  poreSize?: string;
  conditions: Array<{
    name: string;
    probability: number;
    description: string;
    riskLevel: "low" | "medium" | "high";
    symptoms: string[];
    recommendations: string[];
  }>;
  skinInsights: {
    strengths: string[];
    concerns: string[];
    recommendations: string[];
  };
  recommendedProducts: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: string;
    link: string;
  }>;
  chatGptAdvice?: string;
}

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

export const saveAnalysisData = async (
  imageUrl: string,
  formData: SkinFormData,
  analysisResults: SkinAnalysisResult,
  userId: string = 'anonymous'
): Promise<string | null> => {
  try {
    const analysisId = uuidv4();
    
    // Explicitly include the API key in the request by using the supabase instance
    const { error } = await supabase
      .from('skin_analyses')
      .insert([
        {
          id: analysisId,
          user_id: userId,
          image_url: imageUrl,
          form_data: formData,
          analysis_results: analysisResults,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error saving analysis data:', error);
      return null;
    }
    
    return analysisId;
  } catch (error) {
    console.error('Error in saveAnalysisData:', error);
    return null;
  }
};

export const analyzeSkinImage = async (
  imageUrl: string,
  formData: SkinFormData
): Promise<SkinAnalysisResult | null> => {
  try {
    console.log('Sending request to analyze skin image:', imageUrl);
    console.log('Form data being sent:', JSON.stringify(formData, null, 2));
    
    // Set up a timeout mechanism
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("The analysis request timed out. Our AI service might be busy. Please try again later.")), 120000);
    });
    
    try {
      // Call the analyze-skin function with the correct parameters
      const functionCallPromise = supabase.functions.invoke('analyze-skin', {
        body: {
          imageUrl,
          formData
        }
      });
      
      // Race between the function call and timeout
      const { data, error } = await Promise.race([
        functionCallPromise,
        timeoutPromise.then(() => {
          throw new Error("The analysis request timed out. Our AI service might be busy. Please try again later.");
        })
      ]) as { data: SkinAnalysisResult, error: any };
      
      if (error) {
        console.error('Error calling analyze-skin function:', error);
        throw new Error(`Error from analyze-skin function: ${error.message}`);
      }
      
      console.log('Received analysis results:', data);
      
      if (!data) {
        throw new Error("No data returned from analyze-skin function");
      }
      
      return data;
    } catch (err: any) {
      if (err.message?.includes("timed out")) {
        throw new Error("The analysis request timed out. Our AI service might be busy. Please try again later.");
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Error in analyzeSkinImage:', error);
    
    // Map error messages to more user-friendly versions
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error("Network error while connecting to our AI service. Please check your internet connection.");
    }
    
    throw error; // Re-throw other errors
  }
};
