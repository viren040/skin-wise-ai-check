
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-skin-purple font-bold text-2xl">SkinWise</span>
          <span className="bg-skin-purple text-white px-2 py-1 rounded text-xs">AI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium text-gray-700 hover:text-skin-purple transition-colors">
            Home
          </Link>
          <Link to="/about" className="font-medium text-gray-700 hover:text-skin-purple transition-colors">
            How It Works
          </Link>
          <Link to="/faq" className="font-medium text-gray-700 hover:text-skin-purple transition-colors">
            FAQ
          </Link>
          <Link to="/contact" className="font-medium text-gray-700 hover:text-skin-purple transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link 
            to="/check-skin" 
            className="bg-skin-purple hover:bg-opacity-90 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Check Your Skin
          </Link>
        </div>
      </div>
    </header>
  );
};
