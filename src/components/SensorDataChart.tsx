import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { SensorData } from "@/utils/sensorTypes";
import EnvironmentChart from "./EnvironmentChart";
import VisitorChart from "./VisitorChart";
import ThresholdSettings from "./ThresholdSettings";
import TimeRangeSelector from "./TimeRangeSelector";
import ArtifactsMaintenanceTable from "./maintenance/ArtifactsMaintenanceTable";

const DEFAULT_TEMPERATURE_THRESHOLD = 30;
const DEFAULT_HUMIDITY_THRESHOLD = 70;

const fetchSensorData = async (timeRange: string) => {
  console.log("Fetching sensor data with timeRange:", timeRange);
  let query = supabase
    .from("sensor_data")
    .select("*")
    .order("timestamp", { ascending: true });

  // Add time range filter
  const now = new Date();
  switch (timeRange) {
    case "1h":
      query = query.gte("timestamp", new Date(now.getTime() - 60 * 60 * 1000).toISOString());
      break;
    case "6h":
      query = query.gte("timestamp", new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString());
      break;
    case "24h":
      query = query.gte("timestamp", new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString());
      break;
    case "7d":
      query = query.gte("timestamp", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());
      break;
    default:
      // Default to last 24 hours
      query = query.gte("timestamp", new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching sensor data:", error);
    throw error;
  }

  console.log("Sensor data fetched:", data);
  return data;
};

const analyzePredictions = (
  data: SensorData[], 
  tempThreshold: number,
  humidityThreshold: number
) => {
  if (!data || data.length === 0) return null;

  const latestTemp = data[data.length - 1].temperature;
  const latestHumidity = data[data.length - 1].humidity;
  
  const tempTrend = data.slice(-3).reduce((acc, curr, idx, arr) => {
    if (idx === 0) return 0;
    return acc + (curr.temperature - arr[idx - 1].temperature);
  }, 0) / 2;

  const predictions = {
    currentTemp: latestTemp,
    currentHumidity: latestHumidity,
    trend: tempTrend,
    isTemperatureWarning: latestTemp > tempThreshold,
    isHumidityWarning: latestHumidity > humidityThreshold,
    predictedTemp: latestTemp + tempTrend,
    message: '',
    severity: 'default' as 'default' | 'destructive'
  };

  if (predictions.isTemperatureWarning && predictions.isHumidityWarning) {
    predictions.message = `Warning: Both temperature (${latestTemp.toFixed(1)}°C) and humidity (${latestHumidity.toFixed(1)}%) have exceeded thresholds`;
    predictions.severity = 'destructive';
  } else if (predictions.isTemperatureWarning) {
    predictions.message = `Warning: Temperature (${latestTemp.toFixed(1)}°C) has exceeded the threshold of ${tempThreshold}°C`;
    predictions.severity = 'destructive';
  } else if (predictions.isHumidityWarning) {
    predictions.message = `Warning: Humidity (${latestHumidity.toFixed(1)}%) has exceeded the threshold of ${humidityThreshold}%`;
    predictions.severity = 'destructive';
  } else if (predictions.predictedTemp > tempThreshold) {
    predictions.message = `Caution: Temperature is predicted to exceed threshold soon. Current: ${latestTemp.toFixed(1)}°C, Predicted: ${predictions.predictedTemp.toFixed(1)}°C`;
    predictions.severity = 'default';
  } else {
    predictions.message = `All measurements are within normal range. Temperature: ${latestTemp.toFixed(1)}°C, Humidity: ${latestHumidity.toFixed(1)}%`;
    predictions.severity = 'default';
  }

  return predictions;
};

const SensorDataChart = () => {
  const [tempThreshold, setTempThreshold] = useState(DEFAULT_TEMPERATURE_THRESHOLD);
  const [humidityThreshold, setHumidityThreshold] = useState(DEFAULT_HUMIDITY_THRESHOLD);
  const [timeRange, setTimeRange] = useState("24h");

  const { data: sensorData, isLoading, error } = useQuery({
    queryKey: ["sensorData", timeRange],
    queryFn: () => fetchSensorData(timeRange),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading sensor data</div>;
  }

  const latestReading = sensorData?.[sensorData.length - 1] || {
    temperature: 0,
    humidity: 0,
  };

  const formattedData = sensorData?.map((item: SensorData) => ({
    ...item,
    timestamp: format(new Date(item.timestamp), "HH:mm"),
  })) || [];

  const predictions = analyzePredictions(formattedData, tempThreshold, humidityThreshold);

  return (
    <div className="space-y-6">
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      
      {/* Current Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Current Temperature</h3>
          <div className="text-3xl font-bold text-blue-600">
            {latestReading.temperature.toFixed(1)}°C
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Current Humidity</h3>
          <div className="text-3xl font-bold text-green-600">
            {latestReading.humidity.toFixed(1)}%
          </div>
        </div>
      </div>

      <EnvironmentChart data={formattedData} />
      <VisitorChart data={formattedData} />
      
      <ThresholdSettings
        tempThreshold={tempThreshold}
        humidityThreshold={humidityThreshold}
        onTempChange={setTempThreshold}
        onHumidityChange={setHumidityThreshold}
      />

      {predictions && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Environmental Analysis</h3>
          <Alert variant={predictions.severity}>
            <AlertTitle>Status Update</AlertTitle>
            <AlertDescription>
              {predictions.message}
              {predictions.trend !== 0 && (
                <div className="mt-2">
                  Temperature Trend: {predictions.trend > 0 ? "Rising" : "Falling"} 
                  ({Math.abs(predictions.trend).toFixed(2)}°C/hour)
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

    </div>
  );
};

export default SensorDataChart;
