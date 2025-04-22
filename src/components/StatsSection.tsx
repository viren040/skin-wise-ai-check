
export const StatsSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Users Worldwide</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of people who trust SkinWise AI to provide insights about their skin health.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-skin-light-purple/20 rounded-lg">
            <div className="text-4xl font-bold text-skin-purple mb-2">800,000+</div>
            <div className="text-gray-600">Users</div>
          </div>
          
          <div className="text-center p-6 bg-skin-light-purple/20 rounded-lg">
            <div className="text-4xl font-bold text-skin-purple mb-2">2.5M+</div>
            <div className="text-gray-600">Skin Analyses</div>
          </div>
          
          <div className="text-center p-6 bg-skin-light-purple/20 rounded-lg">
            <div className="text-4xl font-bold text-skin-purple mb-2">95%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our AI Can Detect Over 60 Skin Conditions</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Melanoma", "Basal Cell Carcinoma", "Acne", "Eczema", 
              "Psoriasis", "Rosacea", "Atopic Dermatitis", "Hives", 
              "Tinea", "Warts", "Melasma", "Contact Dermatitis"
            ].map((condition, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 text-center text-sm text-gray-700 border border-gray-100">
                {condition}
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-skin-purple text-sm">
            And many more...
          </div>
        </div>
      </div>
    </div>
  );
};
