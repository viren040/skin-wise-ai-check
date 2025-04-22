
import { CheckCircle } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How SkinWise AI Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform makes it easy to check your skin concerns and get personalized recommendations in just a few simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-3 bg-skin-purple"></div>
            <div className="p-6">
              <div className="w-12 h-12 bg-skin-purple/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-skin-purple text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload a Photo</h3>
              <p className="text-gray-600">
                Take a clear, well-lit photo of your skin concern and upload it to our secure platform.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Close-up, focused image</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Good lighting conditions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Center the area of concern</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-3 bg-skin-purple"></div>
            <div className="p-6">
              <div className="w-12 h-12 bg-skin-purple/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-skin-purple text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI technology analyzes your image and compares it with thousands of skin conditions in our database.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Trained on 100,000+ images</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Identifies 60+ conditions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Results in seconds</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-3 bg-skin-purple"></div>
            <div className="p-6">
              <div className="w-12 h-12 bg-skin-purple/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-skin-purple text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Recommendations</h3>
              <p className="text-gray-600">
                Receive personalized insights and recommendations based on your analysis results.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Potential condition insights</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Product suggestions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Next step guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="flex items-start">
            <div className="bg-amber-50 p-3 rounded-full mr-4">
              <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2">Important Note</h4>
              <p className="text-gray-600 text-sm">
                SkinWise AI provides information to help you understand potential skin conditions, but it does not provide a medical diagnosis. Results should be used for informational purposes only. Always consult with a healthcare professional for proper diagnosis and treatment of skin conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
