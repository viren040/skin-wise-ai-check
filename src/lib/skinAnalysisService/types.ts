
export interface SkinFormData {
  concernDescription?: string;
  duration?: string;
  recentChanges?: string;
  isPainful?: string;
  age?: string;
  skinType?: string;
  hasCondition?: string;
  additionalInfo?: string;
}

export interface SkinAnalysisResult {
  id: string;
  skinAge: number;
  skinType: string;
  hydrationLevel: string;
  skinTone?: string;
  uvSensitivity?: string;
  poreSize?: string;
  conditions: Array<{
    name: string;
    probability: number;
    description: string;
    riskLevel: "low" | "medium" | "high";
    symptoms: string[];
    recommendations: string[];
  }>;
  skinInsights: {
    strengths: string[];
    concerns: string[];
    recommendations: string[];
  };
  recommendedProducts: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: string;
    link: string;
  }>;
  chatGptAdvice?: string;
}
