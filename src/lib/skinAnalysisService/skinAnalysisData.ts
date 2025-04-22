
import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';
import type { SkinFormData, SkinAnalysisResult } from './types';

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
