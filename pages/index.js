// pages/index.js
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import LogBox from "../components/LogBox";
import GridBox from "../components/GridBox";
import ControlBox from "../components/ControlBox";

export default function Home() {
    const [logs, setLogs] = useState([]);
    const [plants, setPlants] = useState([]);
    const [animals, setAnimals] = useState([]);

    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on("log", (msg) => setLogs(prev => [...prev, msg]));
        socket.on("gridUpdate", ({ plants, animals }) => {
        setPlants(plants);
        setAnimals(animals);
        });

        return () => socket.disconnect();
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
          <ControlBox />
        </div>
        <GridBox plants={plants} animals={animals} />
      </div>
    </div>
    );
}