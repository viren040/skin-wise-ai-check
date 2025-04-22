
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { 
  analyzeSkinImage, 
  saveAnalysisData, 
  SkinFormData, 
  SkinAnalysisResult 
} from "@/lib/skinAnalysisService";
import { Progress } from "@/components/ui/progress";

interface CheckSkinAnalyzerProps {
  imageUrl: string;
  formData: SkinFormData;
  onAnalysisComplete: (results: SkinAnalysisResult) => void;
  onError: (error: string) => void;
  onProgress: (progress: number) => void;
}

export const CheckSkinAnalyzer = ({
  imageUrl,
  formData,
  onAnalysisComplete,
  onError,
  onProgress
}: CheckSkinAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(30); // Start at 30% (after upload)
  
  useEffect(() => {
    let progressInterval: number | undefined;
    
    const performAnalysis = async () => {
      try {
        // Setup progress simulation
        progressInterval = window.setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) return 90;
            const newProgress = prev + 1;
            onProgress(newProgress);
            return newProgress;
          });
        }, 500);
        
        // Perform the actual analysis
        console.log('Sending request to analyze skin image:', imageUrl);
        console.log('Form data:', formData);
        
        const results = await analyzeSkinImage(imageUrl, formData);
        
        if (!results) {
          throw new Error("Failed to analyze image. Our AI service may be temporarily unavailable or could not process this image.");
        }
        
        // Save the analysis data
        try {
          await saveAnalysisData(imageUrl, formData, results);
          console.log('Analysis data saved successfully');
        } catch (saveError) {
          console.warn('Failed to save analysis data, but continuing with results', saveError);
        }
        
        // Complete the analysis
        clearInterval(progressInterval);
        setProgress(100);
        onProgress(100);
        
        setTimeout(() => {
          setIsAnalyzing(false);
          onAnalysisComplete(results);
          toast.success("Analysis complete!", {
            description: "We've analyzed your skin and identified potential conditions.",
          });
        }, 500);
      } catch (error: any) {
        console.error("Analysis error:", error);
        clearInterval(progressInterval);
        setIsAnalyzing(false);
        
        const errorMessage = error.message || "We encountered an error analyzing your skin. Please try again.";
        onError(errorMessage);
        
        toast.error("Analysis failed", {
          description: errorMessage,
        });
      }
    };
    
    // Only start analysis if we have a valid image URL
    if (imageUrl) {
      performAnalysis();
    } else {
      console.error("No image URL provided for analysis");
      onError("No image provided for analysis. Please upload an image first.");
    }
    
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [imageUrl, formData, onAnalysisComplete, onError, onProgress]);
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md mb-4">
        <Progress value={progress} className="h-2" />
        <p className="text-right text-sm text-gray-500 mt-1">{progress}%</p>
      </div>
      
      <h3 className="text-xl font-medium text-gray-800 mb-2">Analyzing Your Skin</h3>
      <p className="text-gray-600 text-center max-w-md">
        Our AI is examining your image, detecting features, and analyzing potential skin conditions...
      </p>
      
      {progress < 50 && (
        <p className="text-xs text-gray-500 mt-4">Identifying skin features...</p>
      )}
      {progress >= 50 && progress < 70 && (
        <p className="text-xs text-gray-500 mt-4">Analyzing potential conditions...</p>
      )}
      {progress >= 70 && progress < 90 && (
        <p className="text-xs text-gray-500 mt-4">Generating recommendations...</p>
      )}
      {progress >= 90 && (
        <p className="text-xs text-gray-500 mt-4">Finalizing results...</p>
      )}
    </div>
  );
};
