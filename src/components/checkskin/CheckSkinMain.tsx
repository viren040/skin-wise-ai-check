import { useState } from "react";
import { SkinFormData, SkinAnalysisResult as SkinAnalysisResultType } from "@/lib/skinAnalysisService";
import { CheckSkinErrorAlert } from "./CheckSkinErrorAlert";
import { CheckSkinDisclaimer } from "./CheckSkinDisclaimer";
import { CheckSkinDebugInfo } from "./CheckSkinDebugInfo";
import { CheckSkinStepDisplay } from "./CheckSkinStepDisplay";
import { toast } from "@/components/ui/sonner";

export const CheckSkinMain = () => {
  const [step, setStep] = useState<'form' | 'analyzing' | 'results'>('form');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<SkinAnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SkinFormData>({});
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
      lastUpdate: Date.now()
    }));
  };

  const handleFormSubmit = async (formData: FormData) => {
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
    setFormData(skinFormData);
    setStep('analyzing');
    setError(null);
    updateDebugInfo({
      uploadStatus: 'Starting upload...',
      analysisStatus: 'Not started',
      apiError: undefined
    });
  };

  const handleUploadComplete = (result: { success: boolean; imageUrl?: string; error?: string }) => {
    if (result.success && result.imageUrl) {
      setImageUrl(result.imageUrl);
      updateDebugInfo({
        uploadStatus: 'Image uploaded successfully',
        analysisStatus: 'Starting analysis...'
      });
      toast.success("Image uploaded successfully!");
    } else {
      setError(result.error || "Failed to upload image");
      updateDebugInfo({
        uploadStatus: 'Upload failed',
        apiError: result.error,
        analysisStatus: 'Not started'
      });
      
      toast.error("Upload failed", { 
        description: result.error || "Please try again" 
      });
    }
  };

  const handleAnalysisComplete = (results: SkinAnalysisResultType) => {
    setAnalysisResults(results);
    setStep('results');
    updateDebugInfo({
      analysisStatus: 'Analysis complete'
    });
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    updateDebugInfo({
      analysisStatus: `Error: ${errorMessage}`,
      apiError: errorMessage
    });
    toast.error("Analysis failed", {
      description: errorMessage || "Please try again"
    });
  };

  const handleStartOver = () => {
    setStep('form');
    setImageUrl(null);
    setAnalysisProgress(0);
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
      {(process.env.NODE_ENV === 'development' || true) && (
        <CheckSkinDebugInfo debugInfo={debugInfo} imageUrl={imageUrl} />
      )}
      <CheckSkinStepDisplay
        step={step}
        analysisProgress={analysisProgress}
        imageUrl={imageUrl}
        analysisResults={analysisResults}
        formData={formData}
        error={error}
        onFormSubmit={handleFormSubmit}
        onUploadComplete={handleUploadComplete}
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisError={handleAnalysisError}
        onProgress={setAnalysisProgress}
        onStartOver={handleStartOver}
        showApiKeyField={false}
      />
      <CheckSkinDisclaimer />
    </>
  );
};
