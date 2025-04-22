
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkinAnalysisForm } from "@/components/SkinAnalysisForm";
import { SkinAnalysisResult } from "@/components/SkinAnalysisResult";

// Mock data for demonstration
const mockConditions = [
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
];

const mockRecommendations = [
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
];

const CheckSkin = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleFormSubmit = (formData: FormData) => {
    // Extract image file for preview
    const imageFile = formData.get("skinImage") as File;
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
    
    // Simulate API call
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };
  
  const handleStartOver = () => {
    setShowResults(false);
    setImagePreview(null);
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
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-skin-purple border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Analyzing Your Skin</h3>
                <p className="text-gray-600">
                  Our AI is examining your image and comparing it with thousands of cases...
                </p>
              </div>
            ) : showResults ? (
              <SkinAnalysisResult 
                imageUrl={imagePreview || ""}
                conditions={mockConditions}
                recommendations={mockRecommendations}
                onStartOver={handleStartOver}
              />
            ) : (
              <SkinAnalysisForm onSubmit={handleFormSubmit} />
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
