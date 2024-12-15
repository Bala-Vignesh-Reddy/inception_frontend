import { useEffect, useRef } from "react";
import { pipeline, env } from "@huggingface/transformers";

interface FaultDetectorProps {
  selectedModel: string;
  isActive: boolean;
}

const FaultDetector = ({ selectedModel, isActive }: FaultDetectorProps) => {
  const detectorRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive) return;

    const loadModel = async () => {
      try {
        console.log(`Loading ${selectedModel} model...`);
        
        // Configure environment
        env.useBrowserCache = false;
        //@ts-ignore
        env.backends = { onnx: { numThreads: 1 } }; // Configure ONNX runtime
        
        // Use a model that's definitely available and suitable for our use case
        const modelId = selectedModel === 'display' 
          ? 'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k' // Lightweight model for display detection
          : 'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k'; // Same model for artifact detection for now
        
        detectorRef.current = await pipeline('image-classification', modelId);
        console.log(`${selectedModel} model loaded successfully`);
      } catch (error) {
        console.error(`Error loading ${selectedModel} model:`, error);
      }
    };

    loadModel();

    return () => {
      detectorRef.current = null;
      console.log(`Unloading ${selectedModel} model`);
    };
  }, [selectedModel, isActive]);

  useEffect(() => {
    if (!isActive || !detectorRef.current) return;

    const detectFaults = async () => {
      try {
        // Get the video element
        const videoElement = document.querySelector('video');
        if (!videoElement) return;

        // Create a canvas to capture the current frame
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw the current frame to canvas
        ctx.drawImage(videoElement, 0, 0);

        // Convert canvas to blob for model input
        const blob = await new Promise<Blob>((resolve) => 
          canvas.toBlob(blob => resolve(blob!), 'image/jpeg')
        );

        // Run detection on the frame
        const results = await detectorRef.current(blob);
        console.log('Detection results:', results);

        // Check for faults based on model type and classification results
        const hasFault = results.some((result: any) => {
          if (selectedModel === 'display') {
            // Look for display-related issues in classification results
            return result.score > 0.8 && (
              result.label.toLowerCase().includes('broken') ||
              result.label.toLowerCase().includes('damaged')
            );
          } else {
            // Look for artifact-related issues in classification results
            return result.score > 0.8 && (
              result.label.toLowerCase().includes('defect') ||
              result.label.toLowerCase().includes('anomaly')
            );
          }
        });

        if (hasFault) {
          // Dispatch fault detection event
          const event = new CustomEvent("new-anomaly", {
            detail: {
              id: Date.now(),
              type: "error",
              title: `${selectedModel.toUpperCase()} Fault Detected`,
              description: `A fault has been detected in the ${selectedModel} system`,
              timestamp: "Just now",
              source: "system",
            }
          });
          window.dispatchEvent(event);
          console.log(`${selectedModel} fault detected and notification sent`);
        }

      } catch (error) {
        console.error('Error during fault detection:', error);
      }
    };

    // Run detection every 2 seconds
    const interval = setInterval(detectFaults, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedModel, isActive]);

  return null;
};

export default FaultDetector;