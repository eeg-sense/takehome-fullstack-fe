import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const useWebSocket = () => {
    const dispatch = useAppDispatch();
    const isConnected = useAppSelector((state) => state.connection.isConnected);
    
    useEffect(() => {
        dispatch({ type: "websocket/connect" });
        return () => {
          dispatch({ type: "websocket/disconnect" });
        };
      }, [dispatch]);
      

  return {
    isConnected
  };
};

export default useWebSocket;