
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

// Upload image to Supabase Storage
export const uploadSkinImage = async (file: File, userId: string = 'anonymous'): Promise<string | null> => {
  try {
    console.log('Starting image upload process...');
    
    // First ensure the bucket exists
    const bucketExists = await ensureSkinAnalysisBucketExists();
    if (!bucketExists) {
      console.error('Failed to ensure bucket exists');
      return null;
    }

    // Log for debugging
    console.log('Bucket exists, proceeding with upload');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `skin-images/${fileName}`;
    
    console.log('Attempting to upload file:', filePath, 'Size:', file.size, 'Type:', file.type);
    
    // Create a copy of the file to avoid potential issues with the file object
    const fileBlob = file.slice(0, file.size, file.type);
    
    const { data, error } = await supabase.storage
      .from('skin-analysis')
      .upload(filePath, fileBlob, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error.message, error);
      return null;
    }
    
    console.log('Upload successful, getting public URL');
    
    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('skin-analysis')
      .getPublicUrl(filePath);
    
    console.log('Generated public URL:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadSkinImage:', error);
    return null;
  }
};

// Save analysis data to database
export const saveAnalysisData = async (
  imageUrl: string,
  formData: SkinFormData,
  analysisResults: SkinAnalysisResult,
  userId: string = 'anonymous'
): Promise<string | null> => {
  try {
    const analysisId = uuidv4();
    
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

// Request skin analysis from Edge Function
export const analyzeSkinImage = async (
  imageUrl: string,
  formData: SkinFormData
): Promise<SkinAnalysisResult | null> => {
  try {
    console.log('Sending request to analyze skin image:', imageUrl);
    
    const { data, error } = await supabase.functions.invoke('analyze-skin', {
      body: {
        imageUrl,
        formData
      }
    });
    
    if (error) {
      console.error('Error calling analyze-skin function:', error);
      return null;
    }
    
    console.log('Received analysis results:', data);
    return data;
  } catch (error) {
    console.error('Error in analyzeSkinImage:', error);
    return null;
  }
};
