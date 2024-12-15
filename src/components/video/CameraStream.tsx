import { useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface CameraStreamProps {
  onStreamReady?: (stream: MediaStream) => void;
}

const CameraStream = ({ onStreamReady }: CameraStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Camera stream started successfully");
          onStreamReady?.(stream);
          toast({
            title: "Camera Connected",
            description: "Live video feed is now active",
          });
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          variant: "destructive",
          title: "Camera Error",
          description: "Unable to access camera feed",
        });
      }
    }

    setupCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onStreamReady, toast]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="h-full w-full object-cover"
    />
  );
};

export default CameraStream;