
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { StatsSection } from "@/components/StatsSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Early Detection Can Save Lives
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI can help identify potential skin concerns, including early signs of skin cancer, when they're most treatable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-skin-danger/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-skin-danger mb-2">1 in 5</div>
                    <div className="text-gray-700">Americans will develop skin cancer</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm">
                    Skin cancer is the most common cancer in the United States. Early detection is crucial for successful treatment.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-skin-success/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-skin-success mb-2">99%</div>
                    <div className="text-gray-700">5-year survival rate for early detection</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm">
                    When detected early, the 5-year survival rate for melanoma is 99%. Regular skin checks can save lives.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-skin-warning/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-skin-warning mb-2">60+</div>
                    <div className="text-gray-700">Skin conditions detected</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm">
                    Our AI is trained to recognize over 60 different skin conditions, from common concerns to rare disorders.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/check-skin">
                <Button size="lg" className="bg-skin-purple hover:bg-skin-purple/90 text-white px-8">
                  Check Your Skin Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <HowItWorksSection />
        <StatsSection />
        <TestimonialSection />
        
        <section className="py-16 bg-skin-light-purple/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Check Your Skin?
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Get instant insights about your skin concerns with our advanced AI technology. 
                Upload a photo and receive personalized recommendations in seconds.
              </p>
              <Link to="/check-skin">
                <Button size="lg" className="bg-skin-purple hover:bg-skin-purple/90 text-white px-8 shadow-lg shadow-skin-purple/20">
                  Start Skin Check
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-6">
                * Results are for informational purposes only and not a medical diagnosis.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
