import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SensorData } from "@/utils/sensorTypes";

interface EnvironmentChartProps {
  data: SensorData[];
}

const EnvironmentChart = ({ data }: EnvironmentChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <h3 className="text-lg font-semibold mb-4">Temperature & Humidity Trends</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            yAxisId="left" 
            domain={['auto', 'auto']}
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            domain={[0, 100]}
            label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="#8884d8"
            name="Temperature (°C)"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="humidity"
            stroke="#82ca9d"
            name="Humidity (%)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnvironmentChart;