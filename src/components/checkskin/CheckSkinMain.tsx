
import { useState } from "react";
import { SkinAnalysisForm } from "@/components/SkinAnalysisForm";
import { SkinAnalysisResult } from "@/components/SkinAnalysisResult";
import { SkinFormData, SkinAnalysisResult as SkinAnalysisResultType } from "@/lib/skinAnalysisService";
import { CheckSkinProgress } from "./CheckSkinProgress";
import { CheckSkinErrorAlert } from "./CheckSkinErrorAlert";
import { CheckSkinDisclaimer } from "./CheckSkinDisclaimer";
import { CheckSkinUploader } from "./CheckSkinUploader";
import { CheckSkinAnalyzer } from "./CheckSkinAnalyzer";

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
    } else {
      setStep('form');
      setError(result.error || "Failed to upload image");
      updateDebugInfo({ 
        uploadStatus: 'Upload failed',
        apiError: result.error,
        analysisStatus: 'Not started'
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
    setStep('form');
    setError(errorMessage);
    updateDebugInfo({
      analysisStatus: `Error: ${errorMessage}`,
      apiError: errorMessage
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
          {imageUrl && (
            <p className="mt-2">Uploaded Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{imageUrl}</a></p>
          )}
        </div>
      )}
      
      {step === 'analyzing' && (
        <div>
          {!imageUrl ? (
            <div>
              <CheckSkinProgress analysisProgress={analysisProgress} />
              <CheckSkinUploader 
                onUploadComplete={handleUploadComplete} 
                onProgress={setAnalysisProgress} 
              />
            </div>
          ) : (
            <CheckSkinAnalyzer 
              imageUrl={imageUrl}
              formData={formData}
              onAnalysisComplete={handleAnalysisComplete}
              onError={handleAnalysisError}
              onProgress={setAnalysisProgress}
            />
          )}
        </div>
      )}
      
      {step === 'results' && analysisResults && imageUrl && (
        <SkinAnalysisResult 
          imageUrl={imageUrl}
          conditions={analysisResults.conditions}
          recommendations={analysisResults.recommendedProducts}
          skinInsights={analysisResults.skinInsights}
          skinType={analysisResults.skinType}
          skinAge={analysisResults.skinAge}
          hydrationLevel={analysisResults.hydrationLevel}
          onStartOver={handleStartOver}
          chatGptAdvice={analysisResults.chatGptAdvice}
        />
      )}
      
      {step === 'form' && (
        <SkinAnalysisForm onSubmit={handleFormSubmit} showApiKeyField={false} />
      )}
      
      <CheckSkinDisclaimer />
    </>
  );
};
