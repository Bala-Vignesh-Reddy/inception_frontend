import { Input } from "@/components/ui/input";
import { TEMP_RANGE, HUMIDITY_RANGE } from "@/utils/sensorTypes";
import { useToast } from "@/hooks/use-toast";

interface ThresholdSettingsProps {
  tempThreshold: number;
  humidityThreshold: number;
  onTempChange: (value: number) => void;
  onHumidityChange: (value: number) => void;
}

const ThresholdSettings = ({
  tempThreshold,
  humidityThreshold,
  onTempChange,
  onHumidityChange,
}: ThresholdSettingsProps) => {
  const { toast } = useToast();

  const handleTempChange = (value: number) => {
    if (value < TEMP_RANGE.min || value > TEMP_RANGE.max) {
      toast({
        title: "Invalid Temperature",
        description: `Temperature must be between ${TEMP_RANGE.min}°C and ${TEMP_RANGE.max}°C`,
        variant: "destructive",
      });
      return;
    }
    onTempChange(value);
  };

  const handleHumidityChange = (value: number) => {
    if (value < HUMIDITY_RANGE.min || value > HUMIDITY_RANGE.max) {
      toast({
        title: "Invalid Humidity",
        description: `Humidity must be between ${HUMIDITY_RANGE.min}% and ${HUMIDITY_RANGE.max}%`,
        variant: "destructive",
      });
      return;
    }
    onHumidityChange(value);
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Threshold Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="tempThreshold" className="text-sm font-medium">
            Temperature Threshold (°C) - Range: {TEMP_RANGE.min}-{TEMP_RANGE.max}
          </label>
          <Input
            id="tempThreshold"
            type="number"
            value={tempThreshold}
            onChange={(e) => handleTempChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="humidityThreshold" className="text-sm font-medium">
            Humidity Threshold (%) - Range: {HUMIDITY_RANGE.min}-{HUMIDITY_RANGE.max}
          </label>
          <Input
            id="humidityThreshold"
            type="number"
            value={humidityThreshold}
            onChange={(e) => handleHumidityChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ThresholdSettings;