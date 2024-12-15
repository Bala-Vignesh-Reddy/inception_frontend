import { AlertCircle, Server, Database, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnomalyCardProps {
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
  source: "server" | "database" | "system";
}

const AnomalyCard = ({
  type,
  title,
  description,
  timestamp,
  source,
}: AnomalyCardProps) => {
  const getIcon = () => {
    switch (source) {
      case "server":
        return <Server className="h-5 w-5" />;
      case "database":
        return <Database className="h-5 w-5" />;
      default:
        return <Bug className="h-5 w-5" />;
    }
  };

  return (
    <div
      className={cn(
        "animate-fade-in rounded-lg p-4 shadow-sm transition-all hover:shadow-md",
        "border border-gray-100 bg-white/50 backdrop-blur-sm",
        type === "error" && "border-l-4 border-l-red-500",
        type === "warning" && "border-l-4 border-l-amber-500",
        type === "info" && "border-l-4 border-l-blue-500"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-full p-2",
              type === "error" && "bg-red-50 text-red-500",
              type === "warning" && "bg-amber-50 text-amber-500",
              type === "info" && "bg-blue-50 text-blue-500"
            )}
          >
            {getIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{timestamp}</span>
      </div>
    </div>
  );
};

export default AnomalyCard;