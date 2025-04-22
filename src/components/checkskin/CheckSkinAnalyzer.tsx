
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
  const [analysisState, setAnalysisState] = useState<string>("initializing");
  const [apiCallDetails, setApiCallDetails] = useState<{
    gptCalled: boolean;
    promptSent?: string;
    responseReceived?: boolean;
    responseTimestamp?: number;
  }>({
    gptCalled: false
  });
  
  useEffect(() => {
    let progressInterval: number | undefined;
    let analysisTimeout: number | undefined;
    
    // Set a timeout to detect if analysis is taking too long
    analysisTimeout = window.setTimeout(() => {
      if (progress < 90) {
        console.warn("Analysis is taking longer than expected");
        setAnalysisState("delayed");
        onError("Analysis is taking longer than expected. The server might be busy.");
      }
    }, 45000); // 45 seconds timeout
    
    const performAnalysis = async () => {
      try {
        // Setup progress simulation
        progressInterval = window.setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) return 90;
            const newProgress = Math.min(prev + 1, 90);
            onProgress(newProgress);
            return newProgress;
          });
        }, 800); // Slowed down progress to be more realistic
        
        // Update state to show we're about to call the API
        setAnalysisState("preparing_request");
        console.log('Preparing to analyze skin image:', imageUrl);
        console.log('Form data:', formData);
        
        // Update state to show we're calling the API
        setAnalysisState("calling_gpt");
        setApiCallDetails({
          gptCalled: true,
          promptSent: JSON.stringify({
            imageUrl,
            formData
          }, null, 2),
          responseReceived: false
        });
        
        // Perform the actual analysis
        const results = await analyzeSkinImage(imageUrl, formData);
        
        // Update state with API response received
        setApiCallDetails(prev => ({
          ...prev,
          responseReceived: true,
          responseTimestamp: Date.now()
        }));
        
        if (!results) {
          setAnalysisState("failed_no_results");
          throw new Error("Failed to analyze image. Our AI service may be temporarily unavailable or could not process this image.");
        }
        
        // Save the analysis data
        setAnalysisState("saving_results");
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
        setAnalysisState("completed");
        
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
        setAnalysisState(`error: ${error.message || "unknown error"}`);
        
        // Provide more specific error messages based on analysis state
        let errorMessage = error.message || "We encountered an error analyzing your skin. Please try again.";
        
        if (error.message?.includes("timeout") || analysisState === "delayed") {
          errorMessage = "The analysis is taking too long. Our AI service might be busy. Please try again later.";
        } else if (!apiCallDetails.gptCalled) {
          errorMessage = "Failed to connect to our AI service. Please check your internet connection and try again.";
        } else if (apiCallDetails.gptCalled && !apiCallDetails.responseReceived) {
          errorMessage = "Our AI service didn't respond. The server might be overloaded. Please try again later.";
        }
        
        onError(errorMessage);
        
        toast.error("Analysis failed", {
          description: errorMessage,
        });
      } finally {
        if (analysisTimeout) {
          clearTimeout(analysisTimeout);
        }
      }
    };
    
    // Only start analysis if we have a valid image URL
    if (imageUrl) {
      performAnalysis();
    } else {
      console.error("No image URL provided for analysis");
      setAnalysisState("error_no_image");
      onError("No image provided for analysis. Please upload an image first.");
    }
    
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      if (analysisTimeout) {
        clearTimeout(analysisTimeout);
      }
    };
  }, [imageUrl, formData, onAnalysisComplete, onError, onProgress]);
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md mb-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {analysisState !== "error" ? 
              `Status: ${analysisState.replace(/_/g, " ")}` : 
              "Error occurred"}
          </span>
          <p className="text-sm text-gray-500">{progress}%</p>
        </div>
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
      
      {analysisState === "delayed" && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
          Analysis is taking longer than expected. The AI service might be busy processing multiple requests.
          <br />
          <span className="font-medium">Please wait. You will be automatically redirected when analysis completes.</span>
        </div>
      )}
    </div>
  );
};
