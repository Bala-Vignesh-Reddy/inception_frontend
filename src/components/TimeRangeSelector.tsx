import { Button } from "@/components/ui/button";

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeRangeSelector = ({ value, onChange }: TimeRangeSelectorProps) => {
  const timeRanges = [
    { label: "24 Hours", value: "24h" },
    { label: "7 Days", value: "7d" },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Time Range</h3>
      <div className="flex flex-wrap gap-2">
        {timeRanges.map((range) => (
          <Button
            key={range.value}
            variant={value === range.value ? "default" : "outline"}
            onClick={() => onChange(range.value)}
            className="min-w-[100px]"
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeSelector;
