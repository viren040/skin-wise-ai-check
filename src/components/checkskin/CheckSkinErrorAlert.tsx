
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function CheckSkinErrorAlert({ error }: { error: string }) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <div className="mt-1">
          {error}
          {error.includes("Failed to upload image") && (
            <div className="mt-2 text-sm">
              <p>Possible solutions:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Check your internet connection</li>
                <li>Try uploading a smaller image (less than 10MB)</li>
                <li>Make sure the file is a valid image format (JPEG, PNG, etc.)</li>
                <li>Try again in a few minutes</li>
              </ul>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
