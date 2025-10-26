// pages/index.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LogBox from "../components/LogBox";
import GridBox from "../components/GridBox";
import ControlBox from "../components/ControlBox";
import AdderBox from "../components/AdderBox";

export default function Home() {
    const [logs, setLogs] = useState([]);
    const [plants, setPlants] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [gridSize, setGridSize] = useState(5);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io("http://localhost:5000");
        setSocket(socketInstance);

        socketInstance.on("log", (msg) => setLogs(prev => [...prev, msg]));
        socketInstance.on("gridUpdate", ({ plants, animals, gridSize }) => {
        setPlants(plants);
        setAnimals(animals);
        setGridSize(gridSize);
        });

        return () => socketInstance.disconnect();
    }, [])

    return (
      <div className="p-4 min-h-screen bg-white flex flex-col">
        <h1 className="text-2xl text-black font-bold mb-2 ml-8">Ecosystem Simulator</h1>
        <div className="flex flex-row gap-2 w-full max-w-[1800px] items-stretch min-h-[800px]">
          <div className="flex flex-col gap-2 w-80 flex-shrink-0">
            <div className="flex-1">
              <LogBox logs={logs} />
            </div>
            <div className="flex-1">
              <ControlBox socket={socket}/>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex-1">
              <GridBox plants={plants} animals={animals} width={gridSize} height={gridSize}/>
            </div>
            <AdderBox socket={socket}/>
          </div>
        </div>
      </div>
    );
}