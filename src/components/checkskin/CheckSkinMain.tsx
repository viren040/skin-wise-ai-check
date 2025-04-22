
// This is the main logic/handler of the CheckSkin workflow
import { useState } from "react";
import { SkinAnalysisForm } from "@/components/SkinAnalysisForm";
import { SkinAnalysisResult } from "@/components/SkinAnalysisResult";
import { toast } from "@/components/ui/sonner";
import {
  uploadSkinImage,
  analyzeSkinImage,
  saveAnalysisData,
  SkinFormData,
  SkinAnalysisResult as SkinAnalysisResultType
} from "@/lib/skinAnalysisService";
import { CheckSkinProgress } from "./CheckSkinProgress";
import { CheckSkinErrorAlert } from "./CheckSkinErrorAlert";
import { CheckSkinDisclaimer } from "./CheckSkinDisclaimer";

export const CheckSkinMain = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<SkinAnalysisResultType | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    uploadStatus: string;
    analysisStatus: string;
    apiError?: string;
    lastUpdate: number;
  }>({
    uploadStatus: 'Not started',
    analysisStatus: 'Not started',
    lastUpdate: Date.now()
  });

  const updateDebugInfo = (updates: Partial<typeof debugInfo>) => {
    setDebugInfo(prev => ({
      ...prev,
      ...updates,
      lastUpdate: Date.now() // Always update timestamp
    }));
  };

  const handleFormSubmit = async (formData: FormData) => {
    const imageFile = formData.get("skinImage") as File;
    if (!imageFile) {
      toast.error("Please upload an image for analysis");
      return;
    }

    if (!imageFile.type.startsWith('image/')) {
      toast.error("The uploaded file is not an image");
      setError("Please upload a valid image file (JPEG, PNG, etc.)");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) { // 5 MB limit
      toast.error("Image size exceeds the limit of 5MB");
      setError("Please upload a smaller image (under 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(imageFile);

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);
    updateDebugInfo({
      uploadStatus: 'Starting upload...',
      analysisStatus: 'Not started',
      apiError: undefined
    });

    let progressInterval: number | undefined;
    
    try {
      progressInterval = window.setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            return 90;
          }
          return prev + 1; // Slower progress to give more time for processing
        });
      }, 500);

      console.log('Starting image upload process...', imageFile);
      updateDebugInfo({ uploadStatus: 'Uploading image...' });
      
      let imageUrl: string | null = null;
      try {
        // Upload the image
        imageUrl = await uploadSkinImage(imageFile);
        console.log('Upload complete, result:', imageUrl);
        
        if (!imageUrl) {
          throw new Error("Failed to upload image. No URL was returned.");
        }
        
        setUploadedImageUrl(imageUrl);
        setAnalysisProgress(Math.max(30, analysisProgress));
        console.log('Image uploaded successfully:', imageUrl);
        updateDebugInfo({ uploadStatus: 'Image uploaded successfully' });
      } catch (uploadError: any) {
        console.error('Image upload failed:', uploadError);
        updateDebugInfo({ 
          uploadStatus: `Upload failed: ${uploadError.message || 'Unknown error'}`,
          apiError: JSON.stringify(uploadError)
        });
        throw uploadError;
      }

      const skinFormData: SkinFormData = {
        concernDescription: (formData.get("concernDescription") as string) || "",
        duration: (formData.get("duration") as string) || "",
        recentChanges: (formData.get("recentChanges") as string) || "",
        isPainful: (formData.get("isPainful") as string) || "",
        age: (formData.get("age") as string) || "",
        skinType: (formData.get("skinType") as string) || "",
        hasCondition: (formData.get("hasCondition") as string) || "",
        additionalInfo: (formData.get("additionalInfo") as string) || ""
      };

      setAnalysisProgress(Math.max(50, analysisProgress));
      console.log('Sending for analysis with data:', { imageUrl, skinFormData });
      updateDebugInfo({ analysisStatus: 'Analyzing image...' });

      const results = await analyzeSkinImage(imageUrl, skinFormData);
      setAnalysisProgress(Math.max(80, analysisProgress));
      console.log('Analysis results received:', results);
      
      updateDebugInfo({ 
        analysisStatus: results ? 'Analysis complete' : 'Analysis failed' 
      });

      if (results) {
        try {
          await saveAnalysisData(imageUrl, skinFormData, results);
        } catch (saveError) {
          console.warn('Failed to save analysis data, but continuing with results', saveError);
        }
        
        setAnalysisResults(results);

        window.clearInterval(progressInterval);
        setAnalysisProgress(100);

        setTimeout(() => {
          setIsAnalyzing(false);
          setShowResults(true);
          toast.success("Analysis complete!", {
            description: "We've analyzed your skin and identified potential conditions.",
          });
        }, 500);
      } else {
        throw new Error("Failed to analyze image. Our AI service may be temporarily unavailable or could not process this image.");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      
      // Extract more detailed API error information if available
      let errorMessage = error.message || "We encountered an error analyzing your skin. Please try again.";
      let apiError = '';
      
      try {
        // Try to parse if it's a JSON string error
        if (typeof error.message === 'string' && (error.message.includes('{') || error.message.includes('['))) {
          const parsedError = JSON.parse(error.message);
          if (parsedError.message) {
            apiError = parsedError.message;
            errorMessage = `API Error: ${parsedError.message}`;
          }
        } else if (error.error && typeof error.error === 'object') {
          apiError = JSON.stringify(error.error);
          errorMessage = `API Error: ${error.error.message || JSON.stringify(error.error)}`;
        }
      } catch (parseError) {
        // If parsing fails, use the original error message
        console.error("Error parsing error message:", parseError);
      }
      
      setError(errorMessage);
      toast.error("Analysis failed", {
        description: errorMessage,
      });
      setIsAnalyzing(false);
      updateDebugInfo({ 
        uploadStatus: isAnalyzing ? debugInfo.uploadStatus : 'Error occurred',
        analysisStatus: 'Error: ' + (error.message || 'Unknown error'),
        apiError: apiError || JSON.stringify(error)
      });
    } finally {
      if (progressInterval) {
        window.clearInterval(progressInterval);
      }
    }
  };

  const handleStartOver = () => {
    setShowResults(false);
    setImagePreview(null);
    setAnalysisProgress(0);
    setUploadedImageUrl(null);
    setError(null);
    updateDebugInfo({
      uploadStatus: 'Not started',
      analysisStatus: 'Not started',
      apiError: undefined
    });
  };

  return (
    <>
      {error && <CheckSkinErrorAlert error={error} />}
      
      {(process.env.NODE_ENV === 'development' || true) && debugInfo && (
        <div className="mb-4 p-4 bg-gray-100 text-sm rounded border border-gray-300">
          <p className="font-bold">Debug Info:</p>
          <p>Upload Status: {debugInfo.uploadStatus}</p>
          <p>Analysis Status: {debugInfo.analysisStatus}</p>
          <p>Last Updated: {new Date(debugInfo.lastUpdate).toLocaleTimeString()}</p>
          {debugInfo.apiError && (
            <div className="mt-2">
              <p className="text-red-500">API Error Details:</p>
              <pre className="mt-1 p-2 bg-gray-200 rounded overflow-auto max-h-32 text-xs">
                {debugInfo.apiError}
              </pre>
            </div>
          )}
          {uploadedImageUrl && (
            <p className="mt-2">Uploaded Image URL: <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{uploadedImageUrl}</a></p>
          )}
        </div>
      )}
      
      {isAnalyzing ? (
        <CheckSkinProgress analysisProgress={analysisProgress} />
      ) : showResults && analysisResults ? (
        <SkinAnalysisResult 
          imageUrl={uploadedImageUrl || imagePreview || ""}
          conditions={analysisResults.conditions}
          recommendations={analysisResults.recommendedProducts}
          skinInsights={analysisResults.skinInsights}
          skinType={analysisResults.skinType}
          skinAge={analysisResults.skinAge}
          hydrationLevel={analysisResults.hydrationLevel}
          onStartOver={handleStartOver}
          chatGptAdvice={analysisResults.chatGptAdvice}
        />
      ) : (
        <SkinAnalysisForm onSubmit={handleFormSubmit} showApiKeyField={false} />
      )}
      <CheckSkinDisclaimer />
    </>
  );
};
