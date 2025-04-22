
export const TestimonialSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from people who have found value in our AI skin analysis platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <p className="text-gray-700 mb-4">
              "I noticed a mole that looked unusual and used SkinWise AI to check it. The AI suggested it could be concerning and recommended I see a dermatologist. It turned out to be early-stage melanoma. I'm so grateful I caught it early."
            </p>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-skin-purple/20 rounded-full flex items-center justify-center text-skin-purple font-semibold">
                JD
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-800">Jessica D.</div>
                <div className="text-sm text-gray-500">Los Angeles, CA</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <p className="text-gray-700 mb-4">
              "As someone with recurring skin issues, I find this tool incredibly helpful. It correctly identified my eczema flare-up and suggested products that actually helped. It's like having a dermatologist in your pocket!"
            </p>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-skin-purple/20 rounded-full flex items-center justify-center text-skin-purple font-semibold">
                MK
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-800">Michael K.</div>
                <div className="text-sm text-gray-500">Toronto, Canada</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <p className="text-gray-700 mb-4">
              "I was worried about some unusual spots that appeared after a vacation. The AI analysis suggested it was likely tinea versicolor and not something more serious. The peace of mind was worth it, and the treatment recommendations worked perfectly."
            </p>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-skin-purple/20 rounded-full flex items-center justify-center text-skin-purple font-semibold">
                SL
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-800">Sarah L.</div>
                <div className="text-sm text-gray-500">London, UK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
