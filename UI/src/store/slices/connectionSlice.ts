import { createSlice } from "@reduxjs/toolkit";

interface ConnectionState {
  isConnected: boolean;
}

const initialState: ConnectionState = {
  isConnected: false,
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnected: (state) => {
      state.isConnected = true;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
    },
  },
});

export const { setConnected, setDisconnected } = connectionSlice.actions;
export default connectionSlice.reducer;