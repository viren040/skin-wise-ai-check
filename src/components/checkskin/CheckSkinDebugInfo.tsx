
import React from "react";

interface CheckSkinDebugInfoProps {
  debugInfo: {
    uploadStatus: string;
    analysisStatus: string;
    apiError?: string;
    lastUpdate: number;
  };
  imageUrl: string | null;
}

export const CheckSkinDebugInfo = ({
  debugInfo,
  imageUrl
}: CheckSkinDebugInfoProps) => {
  // Fix the type comparison error - process.env.NODE_ENV returns a string, not a boolean
  if (process.env.NODE_ENV !== "development" && !debugInfo) return null;

  return (
    <div className="mb-4 p-4 bg-gray-100 text-sm rounded border border-gray-300">
      <p className="font-bold">Debug Info:</p>
      <p>Upload Status: {debugInfo.uploadStatus}</p>
      <p>Analysis Status: {debugInfo.analysisStatus}</p>
      <p>Last Updated: {new Date(debugInfo.lastUpdate).toLocaleTimeString()}</p>
      {debugInfo.apiError && (
        <div className="mt-2">
          <p className="text-red-500">API Error Details:</p>
          <pre className="mt-1 p-2 bg-gray-200 rounded overflow-auto max-h-32 text-xs">
            {debugInfo.apiError}
          </pre>
        </div>
      )}
      {imageUrl && (
        <p className="mt-2">
          Uploaded Image URL:{" "}
          <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {imageUrl}
          </a>
        </p>
      )}
    </div>
  );
};
