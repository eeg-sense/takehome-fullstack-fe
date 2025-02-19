/* import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const wsUrl = `ws://${API_BASE_URL.replace("http://", "")}/ws`;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: wsUrl }),
  endpoints: (builder) => ({
    getChartData: builder.query<number[][], void>({
      query: () => "/ws",
      keepUnusedDataFor: 5, 
    }),
  }),
});

export const { useGetChartDataQuery } = api;
export default api;
 */