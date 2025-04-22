
import { Progress } from "@/components/ui/progress";

interface CheckSkinAnalysisProgressProps {
  progress: number;
  analysisState: string;
}

export const CheckSkinAnalysisProgress = ({
  progress,
  analysisState,
}: CheckSkinAnalysisProgressProps) => {
  return (
    <div className="w-full max-w-md mb-4">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">
          {analysisState !== "error"
            ? `Status: ${analysisState.replace(/_/g, " ")}`
            : "Error occurred"}
        </span>
        <p className="text-sm text-gray-500">{progress}%</p>
      </div>
    </div>
  );
};
