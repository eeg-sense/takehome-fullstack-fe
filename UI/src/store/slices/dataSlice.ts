import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataState {
  data: { timestamp: number; values: number[] }[];
  movingAverages: { [channelId: string]: number[] };
  movingAverage: { [channelId: string]: number };
}

const initialState: DataState = {
  data: [],
  movingAverages: {},
  movingAverage: {},
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addData: (state, action: PayloadAction<{ timestamp: number; values: number[] }>) => {
      const newData = action.payload;
      const now = Date.now() / 1000;
      if (state.data.some((entry) => entry.timestamp === newData.timestamp)) {
        return;
      }

      state.data = [...state.data, newData].filter((entry) => now - entry.timestamp <= 30);

      const maxDuration = 10;
      newData.values.forEach((value, index) => {
        const channelId = `channel_${index + 1}`;
        
        if (!state.movingAverages[channelId]) {
          state.movingAverages[channelId] = [];
        }
        state.movingAverages[channelId] = [...state.movingAverages[channelId], value].slice(-maxDuration);

        const sum = state.movingAverages[channelId].reduce((acc, val) => acc + val, 0);
        state.movingAverage[channelId] = sum / state.movingAverages[channelId].length;
      });
    },
    
    resetData: (state) => {
      state.data = [];
      state.movingAverages = {};
      state.movingAverage = {};
    },
  },
});

export const { addData, resetData } = dataSlice.actions;
export default dataSlice.reducer;
