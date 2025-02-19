import Header from "../../components/Header";
import DataChart from "../../components/DataChart";
import useWebSocket from "../../hooks/useWebSocket";
import Footer from "../../components/Footer";

const Home = () => {
    const { isConnected } = useWebSocket();
  
    return (
      <div className="w-full flex flex-col home">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-4">
          {!isConnected && <p className="text-red-500">מחכה לחיבור ל-WebSocket</p>}
          <div className="w-full flex justify-center">
            <DataChart />
          </div>
        </main>
        <Footer />
      </div>
    );
  };

export default Home;