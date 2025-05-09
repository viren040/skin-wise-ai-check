import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, AlertCircle, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import { uploadSkinImage } from "@/lib/skinAnalysisService";

interface AnalysisFormProps {
  onSubmit: (data: FormData) => void;
  showApiKeyField?: boolean;
}

export const SkinAnalysisForm = ({ onSubmit, showApiKeyField = false }: AnalysisFormProps) => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("The uploaded file is not an image");
        setUploadError("The uploaded file is not an image");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size exceeds the limit of 5MB");
        setUploadError("Image size exceeds the limit of 5MB");
        return;
      }
      setUploadError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      const newFormData = new FormData();
      newFormData.append("skinImage", file);
      setFormData(newFormData);

      setIsUploading(true);
      setImageUrl(null);
      try {
        const uploadedUrl = await uploadSkinImage(file);
        if (uploadedUrl) {
          setImageUrl(uploadedUrl);
          newFormData.set("skinImageUrl", uploadedUrl);
          setFormData(newFormData);
          toast.success("Image uploaded successfully!");
        } else {
          setUploadError("Failed to upload image.");
          toast.error("Failed to upload image.");
        }
      } catch (err: any) {
        setUploadError(err.message || "Failed to upload image.");
        toast.error("Failed to upload image", { description: err.message });
        setImagePreview(null);
      } finally {
        setIsUploading(false);
      }
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
    if (step < (showApiKeyField ? 4 : 3)) {
      setStep(step + 1);
    } else {
      if (imageUrl) formData.set("skinImageUrl", imageUrl);
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
            {[1, 2, 3, ...(showApiKeyField ? [4] : [])].map((i) => (
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
                    onClick={() => {
                      setImagePreview(null);
                      setImageUrl(null);
                    }} 
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70">
                      <Loader2 className="animate-spin h-9 w-9 text-skin-purple mb-2" />
                      <span className="text-skin-purple text-sm">Uploading...</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="text-skin-purple border-skin-purple hover:bg-skin-light-purple"
                  onClick={() => {
                    setImagePreview(null);
                    setImageUrl(null);
                  }}
                  disabled={isUploading}
                >
                  Upload Different Image
                </Button>
                {uploadError && <div className="text-red-500 mt-2 text-sm">{uploadError}</div>}
                {imageUrl && !isUploading && (
                  <div className="mt-3 text-green-600 text-xs">Image ready! Click Next to continue.</div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 mb-4 cursor-pointer hover:border-skin-purple transition-colors" onClick={() => document.getElementById('image-upload')?.click()}>
                  <Camera className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-center">Click to upload or take a photo</p>
                  <p className="text-gray-400 text-sm text-center mt-2">JPEG, PNG, or JPG (max. 5MB)</p>
                </div>
                <Input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                <Button 
                  variant="outline" 
                  className="text-skin-purple border-skin-purple hover:bg-skin-light-purple"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
                {uploadError && <div className="text-red-500 mt-2 text-sm">{uploadError}</div>}
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
        
        {showApiKeyField && step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-700">API Configuration</h3>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">This is for demo purposes only. In a production app, API keys would be securely stored on the server.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">
                  OpenAI API Key (for demo purposes only)
                </Label>
                <Input 
                  id="apiKey" 
                  name="apiKey" 
                  type="password"
                  placeholder="sk-..."
                  className="mt-1 font-mono"
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your API key is only used for this analysis and is not stored.
                </p>
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> In a real application, API calls would be handled securely through a backend service. This is a simplified demo.
                </p>
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
            disabled={
              (step === 1 && (!imageUrl || isUploading))
            }
            className="bg-skin-purple hover:bg-skin-purple/90"
          >
            {step === (showApiKeyField ? 4 : 3) ? "Analyze My Skin" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
