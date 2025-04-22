
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload } from "lucide-react";

interface AnalysisFormProps {
  onSubmit: (data: FormData) => void;
}

export const SkinAnalysisForm = ({ onSubmit }: AnalysisFormProps) => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        const newFormData = new FormData();
        newFormData.append("skinImage", file);
        setFormData(newFormData);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    formData.set(name, value);
    setFormData(formData);
  };
  
  const handleRadioChange = (name: string, value: string) => {
    formData.set(name, value);
    setFormData(formData);
  };
  
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSubmit(formData);
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-skin-light-purple">
      <CardContent className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Skin Analysis</h2>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i === step 
                    ? "bg-skin-purple text-white" 
                    : i < step 
                      ? "bg-green-100 text-green-600 border border-green-300" 
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
        
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700">Upload a photo of your skin concern</h3>
            <p className="text-gray-500 text-sm">
              For best results, take a clear, well-lit photo centered on the area of concern.
            </p>
            
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-64 rounded-lg overflow-hidden border-2 border-dashed border-skin-light-purple mb-4">
                  <img 
                    src={imagePreview} 
                    alt="Skin concern preview" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => setImagePreview(null)} 
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  className="text-skin-purple border-skin-purple hover:bg-skin-light-purple"
                  onClick={() => setImagePreview(null)}
                >
                  Upload Different Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 mb-4 cursor-pointer hover:border-skin-purple transition-colors" onClick={() => document.getElementById('image-upload')?.click()}>
                  <Camera className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-center">Click to upload or take a photo</p>
                  <p className="text-gray-400 text-sm text-center mt-2">JPEG, PNG, or JPG (max. 10MB)</p>
                </div>
                <Input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
                <Button 
                  variant="outline" 
                  className="text-skin-purple border-skin-purple hover:bg-skin-light-purple"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-6">
              <p>By uploading, you agree to our <a href="/terms" className="text-skin-purple hover:underline">Terms</a> and <a href="/privacy" className="text-skin-purple hover:underline">Privacy Policy</a>.</p>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700">Tell us about your skin concern</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="concernDescription">Describe your skin concern</Label>
                <Textarea 
                  id="concernDescription" 
                  name="concernDescription" 
                  placeholder="E.g., I noticed this mole has changed color over the past month..."
                  className="mt-1"
                  rows={3}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="duration">How long have you had this concern?</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  placeholder="E.g., 2 weeks, 6 months, etc."
                  className="mt-1"
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label>Have you noticed any changes recently?</Label>
                <RadioGroup 
                  defaultValue="no"
                  className="mt-2"
                  onValueChange={(value) => handleRadioChange("recentChanges", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="changes-yes" />
                    <Label htmlFor="changes-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="changes-no" />
                    <Label htmlFor="changes-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Is it painful or irritating?</Label>
                <RadioGroup 
                  defaultValue="no"
                  className="mt-2"
                  onValueChange={(value) => handleRadioChange("isPainful", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="painful-yes" />
                    <Label htmlFor="painful-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="painful-no" />
                    <Label htmlFor="painful-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700">A bit about you</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Your age</Label>
                <Input 
                  id="age" 
                  name="age" 
                  type="number" 
                  placeholder="Enter your age"
                  className="mt-1"
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label>Skin type</Label>
                <RadioGroup 
                  defaultValue="normal"
                  className="mt-2 grid grid-cols-2 gap-2"
                  onValueChange={(value) => handleRadioChange("skinType", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dry" id="skin-dry" />
                    <Label htmlFor="skin-dry">Dry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oily" id="skin-oily" />
                    <Label htmlFor="skin-oily">Oily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="skin-normal" />
                    <Label htmlFor="skin-normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="combination" id="skin-combination" />
                    <Label htmlFor="skin-combination">Combination</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sensitive" id="skin-sensitive" />
                    <Label htmlFor="skin-sensitive">Sensitive</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Do you have any known skin conditions?</Label>
                <RadioGroup 
                  defaultValue="no"
                  className="mt-2"
                  onValueChange={(value) => handleRadioChange("hasCondition", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="condition-yes" />
                    <Label htmlFor="condition-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="condition-no" />
                    <Label htmlFor="condition-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="additionalInfo">Anything else you'd like to share?</Label>
                <Textarea 
                  id="additionalInfo" 
                  name="additionalInfo" 
                  placeholder="Any additional information that might be helpful..."
                  className="mt-1"
                  rows={2}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button 
              variant="outline"
              onClick={handlePrevStep}
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          <Button 
            onClick={handleNextStep}
            disabled={step === 1 && !imagePreview}
            className="bg-skin-purple hover:bg-skin-purple/90"
          >
            {step === 3 ? "Analyze My Skin" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
