import { useEffect, useState } from "react";
import AnomalyCard from "./AnomalyCard";
import { useToast } from "@/hooks/use-toast";

type AnomalyType = {
  id: number;
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
  source: "database" | "server" | "system";
};

const LiveFeed = () => {
  const { toast } = useToast();
  const [anomalies, setAnomalies] = useState<AnomalyType[]>([
    {
      id: 1,
      type: "info",
      title: "Maintenance Status",
      description: "No maintenance needed at this time",
      timestamp: "Just Now",
      source: "system",
    },
    {
      id: 2,
      type: "info",
      title: "Camera Status",
      description: "Camera is working normally",
      timestamp: "1 min ago",
      source: "system",
    },
    {
      id: 3,
      type: "error",
      title: "New Fault Detected",
      description: "System has detected a new fault that requires attention",
      timestamp: "2 min ago",
      source: "system",
    },
  ]);

  useEffect(() => {
    // Only update anomalies when new ones are explicitly added through other components
    const handleNewAnomaly = (newAnomaly: AnomalyType) => {
      setAnomalies(prev => [newAnomaly, ...prev].slice(0, 3));
      
      toast({
        title: newAnomaly.title,
        description: newAnomaly.description,
        variant: newAnomaly.type === "error" ? "destructive" : "default",
      });

      console.log("New anomaly detected:", newAnomaly);
    };

    // You can expose this handler to other components if needed
    window.addEventListener("new-anomaly", (e: any) => handleNewAnomaly(e.detail));
    
    return () => {
      window.removeEventListener("new-anomaly", (e: any) => handleNewAnomaly(e.detail));
    };
  }, [toast]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Notification Center</h2>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>
      <div className="space-y-3">
        {anomalies.map((anomaly) => (
          <AnomalyCard key={anomaly.id} {...anomaly} />
        ))}
      </div>
    </div>
  );
};

export default LiveFeed;