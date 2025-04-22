
import { Progress } from "@/components/ui/progress";

interface CheckSkinProgressProps {
  analysisProgress: number;
}

export const CheckSkinProgress = ({ analysisProgress }: CheckSkinProgressProps) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-full max-w-md mb-4">
      <Progress value={analysisProgress} className="h-2" />
      <p className="text-right text-sm text-gray-500 mt-1">{analysisProgress}%</p>
    </div>
    <h3 className="text-xl font-medium text-gray-800 mb-2">Analyzing Your Skin</h3>
    <p className="text-gray-600 text-center max-w-md">
      Our AI is examining your image, detecting features, and analyzing potential skin conditions...
    </p>
    {analysisProgress < 30 && (
      <p className="text-xs text-gray-500 mt-4">Detecting skin features...</p>
    )}
    {analysisProgress >= 30 && analysisProgress < 60 && (
      <p className="text-xs text-gray-500 mt-4">Identifying potential conditions...</p>
    )}
    {analysisProgress >= 60 && analysisProgress < 90 && (
      <p className="text-xs text-gray-500 mt-4">Generating personalized recommendations...</p>
    )}
    {analysisProgress >= 90 && (
      <p className="text-xs text-gray-500 mt-4">Finalizing results...</p>
    )}
  </div>
);
