
import { SkinAnalysisForm } from "@/components/SkinAnalysisForm";
import { SkinAnalysisResult } from "@/components/SkinAnalysisResult";
import { CheckSkinUploader } from "./CheckSkinUploader";
import { CheckSkinAnalyzer } from "./CheckSkinAnalyzer";
import { CheckSkinProgress } from "./CheckSkinProgress";
import { Button } from "@/components/ui/button";

import type { SkinFormData, SkinAnalysisResult as SkinAnalysisResultType } from "@/lib/skinAnalysisService";

interface Props {
  step: 'form' | 'analyzing' | 'results';
  analysisProgress: number;
  imageUrl: string | null;
  analysisResults: SkinAnalysisResultType | null;
  formData: SkinFormData;
  error: string | null;
  // Step handlers
  onFormSubmit: (formData: FormData) => void;
  onUploadComplete: (result: { success: boolean; imageUrl?: string; error?: string }) => void;
  onAnalysisComplete: (results: SkinAnalysisResultType) => void;
  onAnalysisError: (error: string) => void;
  onProgress: (progress: number) => void;
  onStartOver: () => void;
  showApiKeyField?: boolean;
}

export const CheckSkinStepDisplay = ({
  step,
  analysisProgress,
  imageUrl,
  analysisResults,
  formData,
  error,
  onFormSubmit,
  onUploadComplete,
  onAnalysisComplete,
  onAnalysisError,
  onProgress,
  onStartOver,
  showApiKeyField = false
}: Props) => {
  if (step === "analyzing") {
    // Step 1: Upload the image first
    if (!imageUrl) {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-4">Step 1: Upload your skin image</h3>
          <CheckSkinProgress analysisProgress={analysisProgress} />
          <CheckSkinUploader
            onUploadComplete={onUploadComplete}
            onProgress={onProgress}
          />
        </div>
      );
    }
    
    // Step 2: Analyze the image after it's uploaded
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-center mb-4">Step 2: Analyzing your skin</h3>
        <CheckSkinAnalyzer
          imageUrl={imageUrl}
          formData={formData}
          onAnalysisComplete={onAnalysisComplete}
          onError={onAnalysisError}
          onProgress={onProgress}
        />
      </div>
    );
  }
  
  if (step === "results" && analysisResults && imageUrl) {
    return (
      <SkinAnalysisResult
        imageUrl={imageUrl}
        conditions={analysisResults.conditions}
        recommendations={analysisResults.recommendedProducts}
        skinInsights={analysisResults.skinInsights}
        skinType={analysisResults.skinType}
        skinAge={analysisResults.skinAge}
        hydrationLevel={analysisResults.hydrationLevel}
        onStartOver={onStartOver}
        chatGptAdvice={analysisResults.chatGptAdvice}
      />
    );
  }
  
  // Default to form
  return (
    <SkinAnalysisForm onSubmit={onFormSubmit} showApiKeyField={showApiKeyField} />
  );
};
