
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

    try {
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      console.log('Starting image upload...');
      const imageUrl = await uploadSkinImage(imageFile);
      console.log('Upload complete, result:', imageUrl);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image. This might be due to network issues or permissions. Please try again later.");
      }
      
      setUploadedImageUrl(imageUrl);
      setAnalysisProgress(30);
      console.log('Image uploaded successfully:', imageUrl);

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

      const results = await analyzeSkinImage(imageUrl, skinFormData);
      setAnalysisProgress(80);
      console.log('Analysis results received:', results);

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
        throw new Error("Failed to analyze image. Our AI service may be temporarily unavailable.");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      setError(error.message || "We encountered an error analyzing your skin. Please try again.");
      toast.error("Analysis failed", {
        description: error.message || "We encountered an error analyzing your skin. Please try again.",
      });
      setIsAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    setShowResults(false);
    setImagePreview(null);
    setAnalysisProgress(0);
    setUploadedImageUrl(null);
    setError(null);
  };

  return (
    <>
      {error && <CheckSkinErrorAlert error={error} />}
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
