import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./slices/dataSlice";
import connectionReducer from "./slices/connectionSlice";
import { websocketMiddleware } from "./webSocketMiddleware";

export const store = configureStore({
  reducer: {
    data: dataReducer,
    connection: connectionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(websocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
