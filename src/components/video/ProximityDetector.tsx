import { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { FrameProcessor } from './FrameProcessor';

interface ProximityDetectorProps {
  isActive: boolean;
  onPeopleCountChange?: (count: number) => void;
}

const ProximityDetector = ({ isActive, onPeopleCountChange }: ProximityDetectorProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();
  const [breachCount, setBreachCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);
  const lastAlertTime = useRef<number>(0);
  const frameProcessor = useRef<FrameProcessor | null>(null);
  const ALERT_COOLDOWN = 3000; // 3 seconds between alerts

  useEffect(() => {
    if (!isActive) return;

    frameProcessor.current = new FrameProcessor();
    
    const videoElement = document.querySelector('video');
    if (!videoElement || !canvasRef.current) return;

    canvasRef.current.width = videoElement.clientWidth;
    canvasRef.current.height = videoElement.clientHeight;

    // Draw initial monitoring zone
    drawMonitoringZone();

    // Simulate motion detection every 500ms
    const interval = setInterval(() => {
      if (!frameProcessor.current) return;

      // Simulate person detection (0-2 people)
      const randomPersonCount = Math.floor(Math.random() * 3);
      setPeopleCount(randomPersonCount);
      onPeopleCountChange?.(randomPersonCount);

      // Update monitoring zone color and check for breaches
      drawMonitoringZone(randomPersonCount > 0);
      
      if (randomPersonCount > 0) {
        handleBreachDetection();
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [isActive, onPeopleCountChange]);

  const drawMonitoringZone = (isBreached: boolean = false) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw monitoring zone (40% of frame in center)
    const zoneWidth = canvasRef.current.width * 0.4;
    const zoneHeight = canvasRef.current.height * 0.4;
    const x = (canvasRef.current.width - zoneWidth) / 2;
    const y = (canvasRef.current.height - zoneHeight) / 2;

    // Draw the monitoring zone
    ctx.strokeStyle = isBreached ? 'red' : 'green';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, zoneWidth, zoneHeight);

    // Add zone label
    ctx.font = '16px Arial';
    ctx.fillStyle = isBreached ? 'red' : 'green';
    ctx.fillText(
      'Monitoring Zone',
      x,
      y - 10
    );

    // Draw breach count if any
    if (breachCount > 0) {
      ctx.fillStyle = 'red';
      ctx.fillText(
        `Total Breaches: ${breachCount}`,
        x,
        y + zoneHeight + 20
      );
    }
  };

  const handleBreachDetection = () => {
    const currentTime = Date.now();
    if (currentTime - lastAlertTime.current >= ALERT_COOLDOWN) {
      setBreachCount(prev => prev + 1);
      lastAlertTime.current = currentTime;

      // Trigger notification
      const event = new CustomEvent("new-anomaly", {
        detail: {
          id: Date.now(),
          type: "error",
          title: "Proximity Breach Detected",
          description: `Breach detected! Total breaches: ${breachCount + 1}`,
          timestamp: "Just now",
          source: "proximity",
        }
      });
      window.dispatchEvent(event);

      toast({
        variant: "destructive",
        title: "Proximity Alert",
        description: `Breach detected! Total breaches: ${breachCount + 1}`,
      });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default ProximityDetector;