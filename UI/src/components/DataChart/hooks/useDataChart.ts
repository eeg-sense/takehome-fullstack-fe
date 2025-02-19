import { useMemo } from "react";
import { useAppSelector } from "../../../store/hooks";

export const useDataChart = () => {
  const socketData = useAppSelector((state) => state.data.data);

  const mergedData = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const thirtySecondsAgo = now - 30;
    const uniqueData = new Map();

    socketData
      .filter((sample) => sample.timestamp >= thirtySecondsAgo)
      .forEach((sample) => {
        const timeKey = Math.floor(sample.timestamp);
        if (!uniqueData.has(timeKey)) {
          uniqueData.set(timeKey, sample);
        }
      });

    const filteredData = Array.from(uniqueData.values()).map((sample) => ({
      time: new Date(sample.timestamp * 1000).toLocaleTimeString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...sample.values.reduce((acc: any, value: any, idx: number) => ({ ...acc, [`channel_${idx + 1}`]: value }), {}),
    }));
    
    console.log(filteredData);
    return filteredData;
  }, [socketData]);

  return {
    formattedData: mergedData,
  };
};
