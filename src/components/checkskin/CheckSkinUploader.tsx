
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { uploadSkinImage } from "@/lib/skinAnalysisService";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

interface CheckSkinUploaderProps {
  onUploadComplete: (result: UploadResult) => void;
  onProgress: (progress: number) => void;
}

export const CheckSkinUploader = ({ 
  onUploadComplete, 
  onProgress 
}: CheckSkinUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("The uploaded file is not an image");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size exceeds the limit of 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = async (formData: FormData) => {
    const file = formData.get("skinImage") as File;
    if (!file) {
      toast.error("Please upload an image for analysis");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate initial progress
      setUploadProgress(10);
      onProgress(10);
      
      const imageUrl = await uploadSkinImage(file);
      
      setUploadProgress(100);
      onProgress(30); // Set overall analysis progress to 30%
      
      if (imageUrl) {
        onUploadComplete({
          success: true,
          imageUrl
        });
      } else {
        throw new Error("Upload failed: No URL returned");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadProgress(0);
      
      onUploadComplete({
        success: false,
        error: error.message || "Unknown upload error"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {isUploading && (
        <div className="mb-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
        </div>
      )}
      
      {imagePreview && !isUploading && (
        <div className="border rounded-md p-4 flex flex-col items-center">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-64 max-w-full rounded-md object-contain"
          />
          <p className="text-sm text-gray-500 mt-2">Image ready for upload</p>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-2">
        <input
          type="file"
          id="skinImage"
          name="skinImage"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="skinImage"
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Select Image
        </label>
        
        {imagePreview && !isUploading && (
          <Button
            type="button"
            onClick={() => {
              const formData = new FormData();
              const fileInput = document.getElementById("skinImage") as HTMLInputElement;
              if (fileInput.files?.[0]) {
                formData.append("skinImage", fileInput.files[0]);
                handleUpload(formData);
              }
            }}
            disabled={isUploading}
          >
            Upload & Analyze
          </Button>
        )}
      </div>
    </div>
  );
};
