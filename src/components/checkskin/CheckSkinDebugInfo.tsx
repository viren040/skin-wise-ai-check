
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Bug, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

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
  onRetry?: () => void;
}

export const CheckSkinDebugInfo = ({
  debugInfo,
  imageUrl,
  onRetry
}: CheckSkinDebugInfoProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  
  // Fix the type comparison error - process.env.NODE_ENV returns a string, not a boolean
  if (process.env.NODE_ENV !== "development" && !debugInfo) return null;

  const handleRetry = () => {
    if (onRetry) {
      toast.info("Retrying analysis...");
      onRetry();
    }
  };

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
            <div className="flex justify-between items-center">
              <p>
                <span className="font-semibold">Upload Status:</span> {debugInfo.uploadStatus}
              </p>
              {debugInfo.uploadStatus.includes('Error') && onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetry();
                  }}
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Retry
                </Button>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <p>
                <span className="font-semibold">Analysis Status:</span> {debugInfo.analysisStatus}
              </p>
              {debugInfo.analysisStatus.includes('Error') && onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetry();
                  }}
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Retry Analysis
                </Button>
              )}
            </div>
            
            <p><span className="font-semibold">Last Updated:</span> {new Date(debugInfo.lastUpdate).toLocaleTimeString()}</p>
            
            {debugInfo.gptCalled && (
              <div className="mt-2">
                <p className="font-semibold text-green-600">✓ GPT API was called</p>
                <div className="flex items-center space-x-2 mt-1">
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
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowResponse(!showResponse);
                    }}
                  >
                    {showResponse ? "Hide Response" : "Show Response"}
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
                
                {showResponse && debugInfo.gptResponse && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold">Response from GPT:</p>
                    <pre className="mt-1 p-2 bg-gray-200 rounded overflow-auto max-h-40 text-xs">
                      {debugInfo.gptResponse}
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
            <div className="mt-2">
              <p className="font-semibold">Uploaded Image URL:</p>
              <div className="flex mt-1">
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all text-xs">
                  {imageUrl}
                </a>
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold">Image Preview:</p>
                <div className="mt-1 border border-gray-300 rounded p-1 inline-block">
                  <img 
                    src={imageUrl} 
                    alt="Uploaded skin image" 
                    className="max-h-40 max-w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
