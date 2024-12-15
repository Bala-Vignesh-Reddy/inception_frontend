import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface MotionDetectorProps {
  isActive: boolean;
}

const MotionDetector = ({ isActive }: MotionDetectorProps) => {
  const [faultDetected, setFaultDetected] = useState(false);
  const [isCircular, setIsCircular] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Simulate motion detection
  useEffect(() => {
    if (!isActive) return;

    console.log("Starting simulated motion detection");
    
    // Simulate initial connection success
    toast({
      title: "Motion Detection Active",
      description: "Motion detection simulation started",
    });

    // Simulate motion pattern analysis
    const analyzeMotion = () => {
      // Randomly determine if motion is circular (80% chance of being circular)
      const newIsCircular = Math.random() > 0.2;
      setIsCircular(newIsCircular);
      
      // If motion is not circular for a few consecutive checks, trigger fault
      if (!newIsCircular) {
        setFaultDetected(true);
        toast({
          variant: "destructive",
          title: "Motion Fault Detected",
          description: "No circular motion detected for an extended period",
        });
      } else {
        setFaultDetected(false);
      }

      console.log("Motion analysis result:", { isCircular: newIsCircular, faultDetected: !newIsCircular });
    };

    // Run motion analysis every 3 seconds
    const intervalId = setInterval(analyzeMotion, 3000);

    return () => {
      clearInterval(intervalId);
      console.log("Stopping simulated motion detection");
    };
  }, [isActive, toast]);

  return (
    <div className="absolute bottom-4 left-4 right-4">
      <Alert variant={faultDetected ? "destructive" : "default"}>
        {faultDetected ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        <AlertDescription>
          {faultDetected 
            ? "Motion Fault Detected: No circular motion detected" 
            : isCircular === null 
              ? "Analyzing motion pattern..." 
              : isCircular 
                ? "Circular motion detected" 
                : "Non-circular motion detected"}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MotionDetector;