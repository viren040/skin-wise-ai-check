
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is SkinWise AI?",
    answer: "SkinWise AI is an advanced skin analysis tool that uses artificial intelligence to analyze photos of your skin concerns. It can identify potential skin conditions, provide personalized insights about your skin health, and recommend suitable products and care routines."
  },
  {
    question: "How accurate is the AI analysis?",
    answer: "Our AI model has been trained on thousands of dermatological images and can identify common skin conditions with high accuracy. However, it's important to note that SkinWise AI is not a replacement for professional medical advice. Our tool provides informational insights, but a dermatologist should always be consulted for a definitive diagnosis."
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes, we take your privacy extremely seriously. All images are encrypted during transmission and storage. We do not share your personal information or images with third parties. Your skin analysis data is only used to provide you with results and improve our service with your explicit consent."
  },
  {
    question: "How does the skin analysis work?",
    answer: "Our skin analysis works in three simple steps: 1) You upload a clear photo of your skin concern, 2) You answer a few questions about your skin and the concern, 3) Our AI analyzes the image and your information to provide insights about potential conditions, skin characteristics, and personalized recommendations."
  },
  {
    question: "What types of skin conditions can SkinWise AI detect?",
    answer: "SkinWise AI can identify many common skin conditions including various types of acne, rashes, moles, benign growths, potential signs of skin cancer, fungal infections, and many more. The system is constantly learning and improving its detection capabilities."
  },
  {
    question: "Can SkinWise AI diagnose skin cancer?",
    answer: "SkinWise AI can flag potential signs of skin cancer for further investigation, but it cannot provide a definitive diagnosis. Early detection is crucial for skin cancer, so if our system identifies concerning features, we strongly recommend consulting a dermatologist immediately for proper evaluation."
  },
  {
    question: "How should I take photos for the most accurate results?",
    answer: "For best results: 1) Use good, natural lighting, 2) Make sure the image is clear and in focus, 3) Take the photo straight-on (not at an angle), 4) Include only the affected area and some surrounding skin, 5) Avoid shadows or glare, and 6) For scale reference, you can include a coin or ruler in the photo if relevant."
  },
  {
    question: "Can I use SkinWise AI for all ages?",
    answer: "Yes, SkinWise AI can analyze skin concerns for people of all ages. However, for children under 18, we recommend that a parent or guardian oversee the process and that professional medical advice is always sought for any concerning skin conditions."
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredFAQs = searchQuery.trim() === "" 
    ? faqItems 
    : faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-gray-600">
                Everything you need to know about SkinWise AI and how it can help you
              </p>
            </div>
            
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search for a question..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skin-purple"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 text-left">
                        <span className="text-gray-800 font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-1 text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No results found for "{searchQuery}"</p>
                    <button 
                      className="text-skin-purple mt-2 hover:underline"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </Accordion>
            </div>
            
            <div className="mt-10 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-4">
                Our team is here to help you with anything you need to know about SkinWise AI.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-skin-purple hover:bg-skin-purple/90"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
