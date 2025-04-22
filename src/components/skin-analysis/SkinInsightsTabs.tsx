
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Info } from "lucide-react";

interface SkinInsights {
  strengths: string[];
  concerns: string[];
  recommendations: string[];
}

export const SkinInsightsTabs = ({
  skinInsights,
  chatGptAdvice
}: {
  skinInsights?: SkinInsights;
  chatGptAdvice?: string;
}) => (
  <Card>
    <CardContent className="p-4 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Your Skin Analysis
      </h3>

      {chatGptAdvice && (
        <div className="bg-gray-50 border-l-4 border-teal-400 rounded-md p-4 mb-4 shadow-sm">
          <div className="flex items-center mb-1">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712039.png"
              alt="ChatGPT Icon"
              className="h-6 w-6 mr-2"
            />
            <span className="text-teal-700 font-semibold">AI-Powered Suggestions</span>
          </div>
          <div className="text-gray-700 text-sm whitespace-pre-line">
            {chatGptAdvice}
          </div>
        </div>
      )}

      {skinInsights ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              Skin Strengths
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
              {skinInsights.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <Info className="h-4 w-4 text-amber-600 mr-2" />
              Areas of Concern
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
              {skinInsights.concerns.map((concern, index) => (
                <li key={index}>{concern}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
              Lifestyle Recommendations
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
              {skinInsights.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>No detailed skin insights available for this analysis.</p>
        </div>
      )}
    </CardContent>
  </Card>
);
