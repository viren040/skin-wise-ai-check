import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkinAnalysisForm } from "@/components/SkinAnalysisForm";
import { SkinAnalysisResult } from "@/components/SkinAnalysisResult";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { uploadSkinImage, analyzeSkinImage, saveAnalysisData, SkinFormData, SkinAnalysisResult as SkinAnalysisResultType } from "@/lib/skinAnalysisService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const mockAnalysisResults = {
  skinAge: 32,
  skinType: "Combination",
  hydrationLevel: "Moderate",
  skinTone: "Type III - Medium",
  uvSensitivity: "Moderate",
  poreSize: "Medium",
  conditions: [
    {
      name: "Benign Nevus (Mole)",
      probability: 0.85,
      description: "A benign nevus is a common type of skin growth that develops from pigment-producing cells called melanocytes. Most moles are harmless, but it's important to monitor for changes.",
      riskLevel: "low" as const,
      symptoms: [
        "Uniform color (usually brown or black)",
        "Round or oval shape with well-defined border",
        "Usually less than 6mm in diameter",
        "Flat or slightly raised"
      ],
      recommendations: [
        "Monitor for any changes in size, shape, color, or border",
        "Apply sunscreen regularly to prevent darkening",
        "Consider regular skin checks with a dermatologist"
      ]
    },
    {
      name: "Actinic Keratosis",
      probability: 0.12,
      description: "Actinic keratoses are rough, scaly patches that develop from years of sun exposure. They're considered precancerous as they can develop into skin cancer if untreated.",
      riskLevel: "medium" as const,
      symptoms: [
        "Rough, scaly, or crusty patches",
        "Usually less than 2cm in diameter",
        "Pink, red, or brown color",
        "May itch or burn"
      ],
      recommendations: [
        "Consult with a dermatologist for evaluation",
        "Use a high SPF sunscreen daily",
        "Wear protective clothing in the sun",
        "Consider topical treatments prescribed by a doctor"
      ]
    },
    {
      name: "Seborrheic Keratosis",
      probability: 0.03,
      description: "Seborrheic keratoses are common non-cancerous skin growths that appear as you age. They can look concerning but are harmless and don't require treatment unless they cause discomfort.",
      riskLevel: "low" as const,
      symptoms: [
        "Waxy, stuck-on appearance",
        "Brown, black, or tan color",
        "Round or oval shape",
        "Slightly raised with a warty surface"
      ],
      recommendations: [
        "No treatment necessary unless they become irritated",
        "Avoid picking or scratching",
        "Consult a dermatologist if they change in appearance"
      ]
    }
  ],
  skinInsights: {
    strengths: [
      "Good overall skin texture",
      "No signs of severe sun damage",
      "Healthy skin barrier function"
    ],
    concerns: [
      "Early signs of UV damage visible",
      "Slight hyperpigmentation in cheek areas",
      "Minor dehydration in T-zone"
    ],
    recommendations: [
      "Increase daily water intake to 8-10 glasses",
      "Add a vitamin C serum to your morning routine",
      "Consider using a humidifier in dry environments",
      "Incorporate a gentle chemical exfoliant 2-3 times weekly"
    ]
  },
  recommendedProducts: [
    {
      id: "prod-1",
      name: "UV Shield Sunscreen SPF 50+",
      description: "Broad-spectrum protection with antioxidants to prevent sun damage and hyperpigmentation.",
      imageUrl: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?auto=format&fit=crop&q=80&w=500",
      price: "$24.99",
      link: "#"
    },
    {
      id: "prod-2",
      name: "Gentle Skin Cleanser",
      description: "pH-balanced formula that cleanses without stripping natural oils.",
      imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4ee0e57?auto=format&fit=crop&q=80&w=500",
      price: "$18.50",
      link: "#"
    },
    {
      id: "prod-3",
      name: "Vitamin C Brightening Serum",
      description: "Helps fade hyperpigmentation and brighten skin tone for more even complexion.",
      imageUrl: "https://images.unsplash.com/photo-1611080002742-ed387efd5764?auto=format&fit=crop&q=80&w=500",
      price: "$32.00",
      link: "#"
    }
  ]
};

const CheckSkin = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<SkinAnalysisResultType | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  const isSupabaseConfigured = true;
  
  const handleFormSubmit = async (formData: FormData) => {
    const imageFile = formData.get("skinImage") as File;
    if (!imageFile) {
      toast.error("Please upload an image for analysis");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const imageUrl = await uploadSkinImage(imageFile);
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }
      setUploadedImageUrl(imageUrl);
      setAnalysisProgress(30);
      
      const skinFormData: SkinFormData = {
        concernDescription: formData.get("concernDescription") as string || "",
        duration: formData.get("duration") as string || "",
        recentChanges: formData.get("recentChanges") as string || "",
        isPainful: formData.get("isPainful") as string || "",
        age: formData.get("age") as string || "",
        skinType: formData.get("skinType") as string || "",
        hasCondition: formData.get("hasCondition") as string || "",
        additionalInfo: formData.get("additionalInfo") as string || ""
      };
      
      setAnalysisProgress(50);
      
      const results = await analyzeSkinImage(imageUrl, skinFormData);
      setAnalysisProgress(80);
      
      if (results) {
        await saveAnalysisData(imageUrl, skinFormData, results);
        setAnalysisResults(results);
        
        clearInterval(progressInterval);
        setAnalysisProgress(100);
        
        setTimeout(() => {
          setIsAnalyzing(false);
          setShowResults(true);
          toast.success("Analysis complete!", {
            description: "We've analyzed your skin and identified potential conditions.",
          });
        }, 500);
      } else {
        throw new Error("Failed to analyze image");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed", {
        description: "We encountered an error analyzing your skin. Please try again.",
      });
      setIsAnalyzing(false);
    }
  };
  
  const handleStartOver = () => {
    setShowResults(false);
    setImagePreview(null);
    setAnalysisProgress(0);
    setUploadedImageUrl(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Check Your Skin
              </h1>
              <p className="text-lg text-gray-600">
                Upload a photo of your skin concern and get instant AI-powered analysis and recommendations.
              </p>
            </div>
            
            {!isSupabaseConfigured && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Missing</AlertTitle>
                <AlertDescription>
                  Supabase is not properly configured. This page is running in demo mode with simulated results.
                </AlertDescription>
              </Alert>
            )}
            
            {isAnalyzing ? (
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
            ) : showResults && analysisResults ? (
              <SkinAnalysisResult 
                imageUrl={imagePreview || ""}
                conditions={analysisResults.conditions}
                recommendations={analysisResults.recommendedProducts}
                skinInsights={analysisResults.skinInsights}
                skinType={analysisResults.skinType}
                skinAge={analysisResults.skinAge}
                hydrationLevel={analysisResults.hydrationLevel}
                onStartOver={handleStartOver}
                chatGptAdvice={analysisResults.chatGptAdvice}
              />
            ) : (
              <SkinAnalysisForm onSubmit={handleFormSubmit} showApiKeyField={false} />
            )}
            
            <div className="mt-12 text-sm text-gray-500 text-center">
              <p>
                * SkinWise AI provides information to help you understand potential skin conditions, but it does not provide a medical diagnosis. Results should be used for informational purposes only. Always consult with a healthcare professional for proper diagnosis and treatment of skin conditions.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckSkin;
