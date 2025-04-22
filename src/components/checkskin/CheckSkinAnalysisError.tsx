
interface CheckSkinAnalysisErrorProps {
  analysisState: string;
}

export const CheckSkinAnalysisError = ({ analysisState }: CheckSkinAnalysisErrorProps) => {
  if (analysisState === "delayed") {
    return (
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
        Analysis is taking longer than expected. The AI service might be busy processing multiple requests.
        <br />
        <span className="font-medium">Please wait. You will be automatically redirected when analysis completes.</span>
      </div>
    );
  }
  return null;
};
