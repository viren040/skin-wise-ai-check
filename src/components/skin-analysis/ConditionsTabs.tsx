
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ChevronDown, 
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface Condition {
  name: string;
  probability: number;
  description: string;
  riskLevel: "low" | "medium" | "high";
  symptoms: string[];
  recommendations: string[];
}

export const ConditionsTabs = ({
  conditions
}: {
  conditions: Condition[];
}) => {
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);

  const toggleCondition = (name: string) => {
    setExpandedCondition(expandedCondition === name ? null : name);
  };

  const getRiskColor = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskIcon = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "medium":
        return <Info className="h-4 w-4 text-yellow-600" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Potential Conditions</h3>
        <div className="space-y-4">
          {conditions.map((condition) => (
            <div 
              key={condition.name}
              className="border border-gray-200 rounded-md overflow-hidden bg-white"
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleCondition(condition.name)}
              >
                <div className="flex items-center space-x-3">
                  {getRiskIcon(condition.riskLevel)}
                  <span className="font-medium">{condition.name}</span>
                  <Badge className={getRiskColor(condition.riskLevel)}>
                    {condition.riskLevel}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <div className="mr-3">
                    <span className="text-sm text-gray-500">Match:</span>
                    <span className="ml-1 font-medium">
                      {Math.round(condition.probability * 100)}%
                    </span>
                  </div>
                  {expandedCondition === condition.name ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              {expandedCondition === condition.name && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <p className="text-gray-600 text-sm mb-4">
                    {condition.description}
                  </p>
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Common Symptoms:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {condition.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Recommendations:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {condition.recommendations.map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500 pt-2">
          <p>
            These results are based on visual pattern matching and are not a definitive diagnosis. 
            Always consult with a dermatologist for proper evaluation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
