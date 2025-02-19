import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { useDataChart } from "./hooks/useDataChart";
import { useMovingAverages } from "./hooks/useMovingAverages";

const DataChart = () => {
  const { formattedData } = useDataChart();
  const { averagesData, averages } = useMovingAverages();

  return (
    <div className="w-full bg-white shadow rounded-lg flex justify-center items-center overflow-hidden data-chart">
      <div className="w-full">
        <h2 className="text-lg font-bold text-center mb-4">תרשים נתונים</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart width={800} height={400} data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Array.from({ length: 10 }).map((_, idx) => (
              <Line key={idx} type="monotone" dataKey={`channel_${idx}`} stroke={`hsl(${idx * 36}, 70%, 50%)`} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={400}>
            <LineChart width={800} height={400} data={averagesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />       
              {averages.map(({ channelId }, idx) => (
                <Line
                  key={channelId}
                  type="monotone"
                  dataKey={channelId}
                  stroke={`hsl(${idx * 36}, 70%, 50%)`}
                  dot={false}
                />
              ))}
              {averages.map(({ channelId }, idx) => (
                <Line
                  key={`${channelId}_avg`}
                  type="monotone"
                  dataKey={`${channelId}_avg`}
                  stroke={`hsl(${idx * 36 + 180}, 70%, 50%)`}
                  dot={false}
                  strokeDasharray="5 5"
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataChart;