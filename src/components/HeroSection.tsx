
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-skin-light-purple/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-skin-purple/10 text-skin-purple px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            AI-Powered Skin Analysis
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Advanced AI Skin Analysis At Your Fingertips
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant insights about your skin concerns with our cutting-edge AI technology. Upload a photo and receive personalized recommendations in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/check-skin">
              <Button size="lg" className="bg-skin-purple hover:bg-skin-purple/90 text-white shadow-lg shadow-skin-purple/25 px-8">
                Check Your Skin Now
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50 px-6">
                Learn How It Works
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-gray-500 flex items-center justify-center">
            <div className="flex items-center mr-6">
              <svg className="h-5 w-5 text-skin-purple mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>CE Certified</span>
            </div>
            <div className="flex items-center mr-6">
              <svg className="h-5 w-5 text-skin-purple mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-skin-purple mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Not a Diagnosis</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden md:block absolute top-1/3 -left-16 w-48 h-48 bg-skin-purple/10 rounded-full"></div>
      <div className="hidden md:block absolute bottom-1/4 -right-20 w-64 h-64 bg-skin-purple/5 rounded-full"></div>
    </div>
  );
};
