
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
  }>({
    uploadStatus: 'Not started',
    analysisStatus: 'Not started'
  });

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

    if (imageFile.size > 10 * 1024 * 1024) { // 10 MB limit
      toast.error("Image size exceeds the limit of 10MB");
      setError("Please upload a smaller image (under 10MB)");
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
    setDebugInfo({
      uploadStatus: 'Starting upload...',
      analysisStatus: 'Not started'
    });

    try {
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5; // Slower progress to give more time for processing
        });
      }, 800);

      console.log('Starting image upload process...', imageFile);
      setDebugInfo(prev => ({ ...prev, uploadStatus: 'Uploading image...' }));
      
      // We're using the actual File object now, not creating a new Blob
      const imageUrl = await uploadSkinImage(imageFile);
      console.log('Upload complete, result:', imageUrl);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image. This might be due to network issues or permissions. Please try again later.");
      }
      
      setUploadedImageUrl(imageUrl);
      setAnalysisProgress(30);
      console.log('Image uploaded successfully:', imageUrl);
      setDebugInfo(prev => ({ ...prev, uploadStatus: 'Image uploaded successfully' }));

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

      setAnalysisProgress(50);
      console.log('Sending for analysis with data:', { imageUrl, skinFormData });
      setDebugInfo(prev => ({ ...prev, analysisStatus: 'Analyzing image...' }));

      const results = await analyzeSkinImage(imageUrl, skinFormData);
      setAnalysisProgress(80);
      console.log('Analysis results received:', results);
      
      setDebugInfo(prev => ({ 
        ...prev, 
        analysisStatus: results ? 'Analysis complete' : 'Analysis failed' 
      }));

      if (results) {
        await saveAnalysisData(imageUrl, skinFormData, results);
        setAnalysisResults(results);

        clearInterval(progressInterval);
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
      setError(error.message || "We encountered an error analyzing your skin. Please try again.");
      toast.error("Analysis failed", {
        description: error.message || "We encountered an error analyzing your skin. Please try again.",
      });
      setIsAnalyzing(false);
      setDebugInfo(prev => ({ 
        ...prev, 
        analysisStatus: 'Error: ' + (error.message || 'Unknown error') 
      }));
    }
  };

  const handleStartOver = () => {
    setShowResults(false);
    setImagePreview(null);
    setAnalysisProgress(0);
    setUploadedImageUrl(null);
    setError(null);
    setDebugInfo({
      uploadStatus: 'Not started',
      analysisStatus: 'Not started'
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
          {uploadedImageUrl && (
            <p>Uploaded Image URL: <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{uploadedImageUrl}</a></p>
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
