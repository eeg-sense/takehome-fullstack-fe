import { useMemo } from "react";
import { useAppSelector } from "../../../store/hooks";

export const useMovingAverages = () => {
    const movingAverages = useAppSelector(state => state.data.movingAverages);
    const movingAverage = useAppSelector(state => state.data.movingAverage);

    const averages = useMemo(() => {
      return Object.keys(movingAverages).map((channelId) => ({
        channelId,
        values: movingAverages[channelId],
        average: movingAverage[channelId] || 0,
      }));
    }, [movingAverages, movingAverage]);

    const averagesData = useMemo(() => {
        const numPoints = averages[0]?.values.length || 0;
      
        return Array.from({ length: numPoints }).map((_, i) => {
          const point: Record<string, number> = { time: i + 1 };
          averages.forEach(({ channelId, values, average }) => {
            point[channelId] = values[i];
            point[`${channelId}_avg`] = average;
          });
          return point;
        });
      }, [averages]);
      
  
    return { averagesData, averages };
};
