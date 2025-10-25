// pages/index.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LogBox from "../components/LogBox";
import GridBox from "../components/GridBox";
import ControlBox from "../components/ControlBox";

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
    <div className="p-4 min-h-screen bg-gray-800 flex flex-col items-center">
      <h1 className="text-2xl text-green-400 mb-4">Ecosystem Simulation</h1>
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        gap: "1rem", 
        width: "100%", 
        maxWidth: "1800px", // Increased from 1200px
        alignItems: "flex-start"
      }}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "1rem",
          width: "400px",
          flexShrink: 0
        }}>
          <LogBox logs={logs} />
          <ControlBox socket={socket}/>
        </div>
        <GridBox plants={plants} animals={animals} width={gridSize} height={gridSize}/>
      </div>
    </div>
    );
}