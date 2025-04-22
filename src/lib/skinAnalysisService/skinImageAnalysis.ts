
import { supabase } from '../supabase';
import type { SkinFormData, SkinAnalysisResult } from './types';

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
