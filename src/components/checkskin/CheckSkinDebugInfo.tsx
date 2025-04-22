
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Bug } from "lucide-react";

interface CheckSkinDebugInfoProps {
  debugInfo: {
    uploadStatus: string;
    analysisStatus: string;
    apiError?: string;
    lastUpdate: number;
    gptCalled?: boolean;
    promptSent?: string;
    gptResponse?: string;
  };
  imageUrl: string | null;
}

export const CheckSkinDebugInfo = ({
  debugInfo,
  imageUrl
}: CheckSkinDebugInfoProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  
  // Fix the type comparison error - process.env.NODE_ENV returns a string, not a boolean
  if (process.env.NODE_ENV !== "development" && !debugInfo) return null;

  return (
    <div className="mb-4 p-4 bg-gray-100 text-sm rounded border border-gray-300">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center">
          <Bug className="h-4 w-4 mr-2 text-gray-600" />
          <p className="font-bold">Debug Info</p>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      
      {expanded && (
        <div className="mt-2">
          <div className="space-y-1">
            <p><span className="font-semibold">Upload Status:</span> {debugInfo.uploadStatus}</p>
            <p><span className="font-semibold">Analysis Status:</span> {debugInfo.analysisStatus}</p>
            <p><span className="font-semibold">Last Updated:</span> {new Date(debugInfo.lastUpdate).toLocaleTimeString()}</p>
            
            {debugInfo.gptCalled && (
              <div className="mt-2">
                <p className="font-semibold text-green-600">✓ GPT API was called</p>
                <div className="flex items-center mt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPrompt(!showPrompt);
                    }}
                  >
                    {showPrompt ? "Hide Prompt" : "Show Prompt"}
                  </Button>
                </div>
                
                {showPrompt && debugInfo.promptSent && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold">Prompt sent to GPT:</p>
                    <pre className="mt-1 p-2 bg-gray-200 rounded overflow-auto max-h-40 text-xs">
                      {debugInfo.promptSent}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {debugInfo.apiError && (
            <div className="mt-2">
              <p className="text-red-500 font-semibold">API Error Details:</p>
              <pre className="mt-1 p-2 bg-gray-200 rounded overflow-auto max-h-32 text-xs">
                {debugInfo.apiError}
              </pre>
            </div>
          )}
          
          {imageUrl && (
            <p className="mt-2">
              <span className="font-semibold">Uploaded Image URL:</span>{" "}
              <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">
                {imageUrl}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
