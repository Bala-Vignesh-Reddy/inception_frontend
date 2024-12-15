import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: "up" | "down";
  trendValue?: string;
}

const StatCard = ({ title, value, trend, trendValue }: StatCardProps) => {
  return (
    <div className="rounded-lg border border-gray-100 bg-white/50 p-4 shadow-sm backdrop-blur-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && trendValue && (
          <span
            className={cn(
              "ml-2 text-sm",
              trend === "up" ? "text-green-600" : "text-red-600"
            )}
          >
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;