
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SkinWise AI</h3>
            <p className="text-gray-600 mb-4">
              AI-powered skin analysis for early detection and personalized care recommendations.
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SkinWise AI. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-skin-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/check-skin" className="text-gray-600 hover:text-skin-purple transition-colors">
                  Check Your Skin
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-skin-purple transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-skin-purple transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-skin-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-skin-purple transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-4">Contact</h4>
            <p className="text-gray-600 mb-2">
              Have questions or feedback?
            </p>
            <Link 
              to="/contact" 
              className="text-skin-purple hover:underline transition-colors"
            >
              Contact Us
            </Link>
            <div className="mt-4 flex space-x-4">
              {/* Social icons would go here */}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500 text-center">
          <p>
            * SkinWise AI is not a diagnostic tool. It is designed to provide information and suggestions only. Always consult with a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};
