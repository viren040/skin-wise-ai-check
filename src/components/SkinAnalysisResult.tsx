
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkinSnapshotCard } from "./skin-analysis/SkinSnapshotCard";
import { ConditionsTabs } from "./skin-analysis/ConditionsTabs";
import { SkinInsightsTabs } from "./skin-analysis/SkinInsightsTabs";
import { ProductsTabs } from "./skin-analysis/ProductsTabs";
import { NextStepsInfo } from "./skin-analysis/NextStepsInfo";

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
  chatGptAdvice?: string;
}

export const SkinAnalysisResult = ({
  imageUrl,
  conditions,
  recommendations,
  skinInsights,
  skinType = "Not analyzed",
  skinAge,
  hydrationLevel = "Not analyzed",
  onStartOver,
  chatGptAdvice
}: SkinAnalysisResultProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SkinSnapshotCard
            imageUrl={imageUrl}
            skinType={skinType}
            skinAge={skinAge}
            hydrationLevel={hydrationLevel}
            onStartOver={onStartOver}
          />
        </div>
        <div className="md:col-span-2">
          <Tabs defaultValue="conditions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="insights">Skin Insights</TabsTrigger>
              <TabsTrigger value="products">Recommendations</TabsTrigger>
            </TabsList>
            <TabsContent value="conditions" className="mt-4">
              <ConditionsTabs conditions={conditions} />
            </TabsContent>
            <TabsContent value="insights" className="mt-4">
              <SkinInsightsTabs
                skinInsights={skinInsights}
                chatGptAdvice={chatGptAdvice}
              />
            </TabsContent>
            <TabsContent value="products" className="mt-4">
              <ProductsTabs recommendations={recommendations} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <NextStepsInfo />
    </div>
  );
};
