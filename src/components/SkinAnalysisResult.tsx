
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ChevronDown, 
  ChevronUp,
  ShoppingBag,
  Droplets,
  Calendar,
  Clock
} from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface Condition {
  name: string;
  probability: number;
  description: string;
  riskLevel: "low" | "medium" | "high";
  symptoms: string[];
  recommendations: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  link: string;
}

interface SkinInsights {
  strengths: string[];
  concerns: string[];
  recommendations: string[];
}

interface SkinAnalysisResultProps {
  imageUrl: string;
  conditions: Condition[];
  recommendations: Product[];
  skinInsights?: SkinInsights;
  skinType?: string;
  skinAge?: number;
  hydrationLevel?: string;
  onStartOver: () => void;
}

export const SkinAnalysisResult = ({ 
  imageUrl, 
  conditions, 
  recommendations,
  skinInsights,
  skinType = "Not analyzed",
  skinAge,
  hydrationLevel = "Not analyzed",
  onStartOver 
}: SkinAnalysisResultProps) => {
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
  
  const toggleCondition = (name: string) => {
    if (expandedCondition === name) {
      setExpandedCondition(null);
    } else {
      setExpandedCondition(name);
    }
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow">
            <img 
              src={imageUrl} 
              alt="Skin concern" 
              className="w-full h-auto object-cover"
            />
            
            <div className="p-4 space-y-3 border-t border-gray-100">
              <h3 className="font-medium text-gray-900">Your Skin Snapshot</h3>
              
              {skinType && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Skin Type:</span>
                  <span className="text-sm font-medium">{skinType}</span>
                </div>
              )}
              
              {skinAge && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Skin Age:</span>
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                    <span className="text-sm font-medium">{skinAge} years</span>
                  </div>
                </div>
              )}
              
              {hydrationLevel && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Hydration:</span>
                  <div className="flex items-center">
                    <Droplets className="h-3.5 w-3.5 text-blue-400 mr-1" />
                    <span className="text-sm font-medium">{hydrationLevel}</span>
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={onStartOver}
              >
                Check Another Concern
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="conditions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="insights">Skin Insights</TabsTrigger>
              <TabsTrigger value="products">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="conditions" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Potential Conditions
                  </h3>
                  
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
            </TabsContent>
            
            <TabsContent value="insights" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Your Skin Analysis
                  </h3>
                  
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
            </TabsContent>
            
            <TabsContent value="products" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recommended Products
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {recommendations.map((product) => (
                      <div 
                        key={product.id}
                        className="flex border border-gray-200 rounded-md overflow-hidden bg-white"
                      >
                        <div className="w-24 h-24 flex-shrink-0">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 p-3">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium text-gray-900">
                              {product.price}
                            </span>
                            
                            <a 
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-skin-purple hover:text-skin-purple/90"
                            >
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              View Product
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-4">
                    <p>
                      Products are recommended based on your skin analysis. Individual results may vary.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">What's Next?</h3>
        <p className="text-sm text-blue-800">
          For a professional diagnosis, consider scheduling a consultation with a dermatologist. 
          They can provide a definitive diagnosis and personalized treatment plan.
        </p>
      </div>
    </div>
  );
};
