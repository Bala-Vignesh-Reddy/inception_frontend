import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CameraStream from "./video/CameraStream";
import ProximityDetector from "./video/ProximityDetector";
import MisalignmentDetector from "./video/MisalignmentDetector";
import MotionBoundingBox from "./video/MotionBoundingBox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface VideoFeedProps {
  tab?: string;
  onPeopleCountChange?: (count: number) => void;
  showMotionBoundingBox?: boolean;
}

const VideoFeed = ({ tab, onPeopleCountChange, showMotionBoundingBox }: VideoFeedProps) => {
  const [detectionMode, setDetectionMode] = useState("camera");
  const { toast } = useToast();

  useEffect(() => {
    if (tab === "fault" && detectionMode === "display") {
      toast({
        title: "Fault Detected",
        description: "A potential fault has been detected in the system",
        variant: "destructive",
      });
    }
  }, [detectionMode, tab, toast]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Live Camera Feed {tab ? `(${tab})` : ""}</CardTitle>
        {tab === "fault" && (
          <Select
            value={detectionMode}
            onValueChange={(value) => setDetectionMode(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select detection mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="camera">Display Checking</SelectItem>
              <SelectItem value="display">Fault Detection</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video rounded-lg border bg-muted">
          {tab === "fault" ? (
            detectionMode === "camera" ? (
              <CameraStream />
            ) : (
              <img 
                src="/lovable-uploads/1f1dca40-c0e4-49ae-927f-714fdabee43c.png" 
                alt="Fault Detection Analysis"
                className="h-full w-full object-contain"
              />
            )
          ) : (
            <>
              <CameraStream />
              {tab === "proximity" && (
                <ProximityDetector 
                  isActive={true} 
                  onPeopleCountChange={onPeopleCountChange}
                />
              )}
              {tab === "misalignment" && (
                <MisalignmentDetector isActive={true} />
              )}
              {tab === "motion" && showMotionBoundingBox && (
                <MotionBoundingBox isActive={true} />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoFeed;