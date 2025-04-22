
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Info, AlertTriangle } from "lucide-react";

interface ProductRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  link: string;
}

interface SkinCondition {
  name: string;
  probability: number;
  description: string;
  riskLevel: "low" | "medium" | "high";
  symptoms: string[];
  recommendations: string[];
}

interface SkinAnalysisResultProps {
  imageUrl: string;
  conditions: SkinCondition[];
  recommendations: ProductRecommendation[];
  onStartOver: () => void;
}

export const SkinAnalysisResult = ({
  imageUrl,
  conditions,
  recommendations,
  onStartOver
}: SkinAnalysisResultProps) => {
  const [activeTab, setActiveTab] = useState("analysis");
  
  const getPriorityCondition = () => {
    if (conditions.length === 0) return null;
    return conditions.reduce((prev, current) => 
      prev.probability > current.probability ? prev : current
    );
  };
  
  const priorityCondition = getPriorityCondition();
  const riskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-amber-600 bg-amber-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-skin-light-purple">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Skin Analysis Results</h2>
          <p className="text-gray-500 text-sm mt-1">
            Based on the image and information you provided
          </p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-amber-700 text-sm">
              <strong>Important disclaimer:</strong> This analysis is for informational purposes only and not a medical diagnosis. 
              Please consult with a healthcare professional for proper diagnosis and treatment.
            </p>
          </div>
        </div>
        
        <Tabs 
          defaultValue="analysis" 
          className="mt-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
                  <img 
                    src={imageUrl} 
                    alt="Analyzed skin" 
                    className="w-full h-auto"
                  />
                </div>
                
                {priorityCondition && (
                  <div className="bg-white border border-gray-200 rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Primary Assessment</h3>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{priorityCondition.name}</span>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${riskLevelColor(priorityCondition.riskLevel)}`}>
                        {priorityCondition.riskLevel === "high" ? "High attention needed" : 
                          priorityCondition.riskLevel === "medium" ? "Moderate attention" : "Low concern"}
                      </span>
                    </div>
                    <div className="h-2 mb-2 relative w-full rounded-full bg-gray-100 overflow-hidden">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full ${
                          priorityCondition.riskLevel === "high" ? "bg-red-500" : 
                          priorityCondition.riskLevel === "medium" ? "bg-amber-500" : 
                          "bg-green-500"
                        }`}
                        style={{ width: `${priorityCondition.probability * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {priorityCondition.description}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Potential Conditions</h3>
                
                <Accordion type="single" collapsible className="w-full">
                  {conditions.map((condition, index) => (
                    <AccordionItem value={`condition-${index}`} key={index}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex justify-between items-center w-full pr-4">
                          <span className="font-medium">{condition.name}</span>
                          <span className="text-sm px-2 py-0.5 rounded-full ml-2 hidden sm:block">
                            {Math.round(condition.probability * 100)}%
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-2">
                          <div className="h-2 mb-3 relative w-full rounded-full bg-gray-100 overflow-hidden">
                            <div 
                              className={`absolute left-0 top-0 h-full rounded-full ${
                                condition.riskLevel === "high" ? "bg-red-500" : 
                                condition.riskLevel === "medium" ? "bg-amber-500" : 
                                "bg-green-500"
                              }`}
                              style={{ width: `${condition.probability * 100}%` }}
                            />
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3">
                            {condition.description}
                          </p>
                          
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-1">Common symptoms:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {condition.symptoms.map((symptom, idx) => (
                                <li key={idx}>{symptom}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1">Recommendations:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {condition.recommendations.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                <div className="mt-6 bg-gray-50 rounded-md p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">
                      These percentages represent the visual similarity to known conditions, not a definitive diagnosis. Always consult a healthcare professional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Product Recommendations</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Based on your analysis, here are some products that might help with your skin concern.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-gray-800 mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-skin-purple font-medium">{product.price}</span>
                          <a 
                            href={product.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-skin-purple hover:underline"
                          >
                            Learn more
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-md p-4 mt-6">
                <h3 className="text-lg font-medium mb-2">General Care Recommendations</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">
                      <strong>Sun Protection:</strong> Apply broad-spectrum SPF 30+ sunscreen daily, even on cloudy days.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">
                      <strong>Gentle Cleansing:</strong> Use a mild, fragrance-free cleanser suited for your skin type.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">
                      <strong>Hydration:</strong> Stay well-hydrated and use moisturizers appropriate for your skin type.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">
                      <strong>Regular Monitoring:</strong> Keep track of any changes in your skin and take photos for comparison.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="next-steps" className="mt-6">
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-md p-4">
                <h3 className="text-lg font-medium mb-3">What To Do Next</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-skin-purple/10 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-skin-purple text-white text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Monitor Your Skin</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Keep track of any changes in your skin concern. Take photos periodically to notice any changes in size, color, or appearance.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-skin-purple/10 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-skin-purple text-white text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Consider Professional Advice</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        If your concern persists or worsens, consider consulting with a dermatologist or healthcare provider. This analysis is not a substitute for professional medical advice.
                      </p>
                      <Button className="mt-2 bg-skin-purple hover:bg-skin-purple/90">
                        Find a Dermatologist
                      </Button>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-skin-purple/10 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-skin-purple text-white text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Follow Care Recommendations</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Implement the care recommendations and consider the suggested products that may help with your skin concern.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-skin-purple/10 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-skin-purple text-white text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Check Back Later</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Re-analyze your skin in a few weeks to track progress and get updated recommendations.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-skin-light-purple/20 rounded-md p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-medium text-gray-800">Save Your Results</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Save this analysis to track your skin's progress over time.
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="border-skin-purple text-skin-purple hover:bg-skin-light-purple/50">
                      Email Results
                    </Button>
                    <Button className="bg-skin-purple hover:bg-skin-purple/90">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline"
            onClick={onStartOver}
          >
            Start Over
          </Button>
          
          <Button 
            className="bg-skin-purple hover:bg-skin-purple/90"
            onClick={() => {
              if (activeTab === "analysis") setActiveTab("recommendations");
              else if (activeTab === "recommendations") setActiveTab("next-steps");
            }}
            disabled={activeTab === "next-steps"}
          >
            {activeTab === "analysis" ? "View Recommendations" : 
             activeTab === "recommendations" ? "See Next Steps" : "Done"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
