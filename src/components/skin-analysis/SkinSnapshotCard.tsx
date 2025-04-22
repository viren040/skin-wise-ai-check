
import { Button } from "@/components/ui/button";
import { Droplets, Calendar } from "lucide-react";

interface SkinSnapshotCardProps {
  imageUrl: string;
  skinType?: string;
  skinAge?: number;
  hydrationLevel?: string;
  onStartOver: () => void;
}

export const SkinSnapshotCard = ({
  imageUrl,
  skinType,
  skinAge,
  hydrationLevel,
  onStartOver,
}: SkinSnapshotCardProps) => (
  <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow">
    <img 
      src={imageUrl} 
      alt="Skin concern" 
      className="w-full h-auto object-cover"
    />
    <div className="p-4 space-y-3 border-t border-gray-100">
      <h3 className="font-medium text-gray-900">Your Skin Snapshot</h3>
      
      {skinType && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Skin Type:</span>
          <span className="text-sm font-medium">{skinType}</span>
        </div>
      )}
      {skinAge !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Skin Age:</span>
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
            <span className="text-sm font-medium">{skinAge} years</span>
          </div>
        </div>
      )}
      {hydrationLevel && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Hydration:</span>
          <div className="flex items-center">
            <Droplets className="h-3.5 w-3.5 text-blue-400 mr-1" />
            <span className="text-sm font-medium">{hydrationLevel}</span>
          </div>
        </div>
      )}

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2"
        onClick={onStartOver}
      >
        Check Another Concern
      </Button>
    </div>
  </div>
);
