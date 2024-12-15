import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SensorData } from "@/utils/sensorTypes";

interface VisitorChartProps {
  data: SensorData[];
}

const VisitorChart = ({ data }: VisitorChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <h3 className="text-lg font-semibold mb-4">Visitor Count</h3>
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
            domain={[0, 'auto']}
            label={{ value: 'Number of Visitors', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#ffa726"
            name="Visitors"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorChart;