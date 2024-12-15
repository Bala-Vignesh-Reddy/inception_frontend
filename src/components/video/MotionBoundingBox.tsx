import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { RotateCw, XCircle } from 'lucide-react';

interface MotionBoundingBoxProps {
  isActive: boolean;
}

const MotionBoundingBox = ({ isActive }: MotionBoundingBoxProps) => {
  const [isCircularMotion, setIsCircularMotion] = useState(true);
  const { toast } = useToast();
  
  // Reduced frame dimensions for motion detection
  const MOTION_FRAME = {
    x: 80,
    y: 60,
    width: 480,
    height: 280
  };

  useEffect(() => {
    if (!isActive) return;

    console.log("Starting motion detection with bounding box");

    const detectMotion = () => {
      const newIsCircular = Math.random() > 0.3;
      
      if (newIsCircular !== isCircularMotion) {
        setIsCircularMotion(newIsCircular);
        
        toast({
          variant: newIsCircular ? "default" : "destructive",
          title: newIsCircular ? "Circular Motion Detected" : "Non-Circular Motion Detected",
          description: newIsCircular 
            ? "Object is moving in a circular pattern"
            : "Object's motion pattern is irregular",
        });

        const event = new CustomEvent("new-anomaly", {
          detail: {
            id: Date.now(),
            type: newIsCircular ? "success" : "error",
            title: newIsCircular ? "Circular Motion Detected" : "Non-Circular Motion Detected",
            description: newIsCircular 
              ? "Object is moving in a circular pattern"
              : "Object's motion pattern is irregular",
            timestamp: "Just now",
            source: "motion",
          }
        });
        window.dispatchEvent(event);
      }
    };

    const interval = setInterval(detectMotion, 2000);
    detectMotion();

    return () => {
      clearInterval(interval);
      console.log("Stopping motion detection");
    };
  }, [isActive, isCircularMotion, toast]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className={`absolute border-4 ${
          isCircularMotion ? 'border-green-500' : 'border-red-500'
        } transition-colors duration-300 rounded-lg`}
        style={{
          left: `${MOTION_FRAME.x}px`,
          top: `${MOTION_FRAME.y}px`,
          width: `${MOTION_FRAME.width}px`,
          height: `${MOTION_FRAME.height}px`
        }}
      >
        <div className="absolute -top-8 left-0 flex items-center gap-2 bg-background/80 px-3 py-1 rounded-full">
          <span className={`font-medium ${
            isCircularMotion ? 'text-green-500' : 'text-red-500'
          }`}>
            {isCircularMotion ? 'Circular Motion' : 'Irregular Motion'}
          </span>
          {isCircularMotion ? (
            <RotateCw className="w-5 h-5 text-green-500 animate-spin" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MotionBoundingBox;