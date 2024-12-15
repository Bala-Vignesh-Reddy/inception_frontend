import { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from 'lucide-react';

interface MisalignmentDetectorProps {
  isActive: boolean;
}

const MisalignmentDetector = ({ isActive }: MisalignmentDetectorProps) => {
  const { toast } = useToast();
  const [isAligned, setIsAligned] = useState(true);
  const lastNotificationTime = useRef<number>(0);

  // Frame dimensions
  const FRAME_CONFIG = {
    x: 50,
    y: 50,
    width: 200,
    height: 280
  };

  useEffect(() => {
    if (!isActive) return;

    const simulateAlignment = () => {
      // Simulate object position (randomly inside or outside the frame)
      const randomAlignment = Math.random() > 0.3; // 70% chance of being aligned
      
      if (randomAlignment !== isAligned) {
        setIsAligned(randomAlignment);
        const now = Date.now();
        if (now - lastNotificationTime.current > 2000) {
          lastNotificationTime.current = now;
          
          // Dispatch event for the live feed
          const event = new CustomEvent("new-anomaly", {
            detail: {
              id: Date.now(),
              type: randomAlignment ? "success" : "error",
              title: randomAlignment ? "Object Aligned" : "Misalignment Detected",
              description: randomAlignment 
                ? "Object is properly aligned within frame"
                : "Object has crossed the border of the frame!",
              timestamp: "Just now",
              source: "misalignment",
            }
          });
          window.dispatchEvent(event);

          // Show toast notification
          toast({
            variant: randomAlignment ? "default" : "destructive",
            title: randomAlignment ? "Object Aligned" : "Misalignment Detected",
            description: randomAlignment 
              ? "Object is properly aligned within frame"
              : "Object has crossed the border of the frame!",
          });
        }
      }
    };

    // Run simulation every 2 seconds
    const interval = setInterval(simulateAlignment, 2000);

    // Initial simulation
    simulateAlignment();

    return () => {
      clearInterval(interval);
    };
  }, [isActive, isAligned, toast]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Bounding Box */}
      <div 
        className={`absolute border-2 ${isAligned ? 'border-green-500' : 'border-red-500'} transition-colors duration-300`}
        style={{
          left: `${FRAME_CONFIG.x}px`,
          top: `${FRAME_CONFIG.y}px`,
          width: `${FRAME_CONFIG.width}px`,
          height: `${FRAME_CONFIG.height}px`
        }}
      >
        {/* Status Text and Icon */}
        <div className="absolute -top-8 left-0 flex items-center gap-2">
          <span className={`font-medium ${isAligned ? 'text-green-500' : 'text-red-500'}`}>
            {isAligned ? 'Aligned' : 'Misaligned'}
          </span>
          {isAligned ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MisalignmentDetector;