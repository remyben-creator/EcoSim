import { useState } from "react";

// components/ControlBox.js

export default function ControlBox({ socket }) {
  const [plantsNum, setPlantsNum] = useState(5);
  const [rabbitsNum, setRabbitsNum] = useState(5);
  const [foxesNum, setFoxesNum] = useState(2);
  const [gridSize, setGridSize] = useState(5);

  const handleResetEcosystem = () => {
    if (socket) {
      socket.emit("resetEcosystem", {
        plantsNum,
        rabbitsNum,
        foxesNum,
        gridSize
      });
    }
  };

  const handleStartSimulation = () => {
    if (socket) {
      socket.emit("startSimulation");
    }
  };

  const handlePauseSimulation = () => {
    if (socket) {
      socket.emit("pauseSimulation");
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white font-mono rounded shadow-lg min-h-52"
      style={{
        border: "3px solid black",
        width: "400px",
        boxSizing: "border-box",
      }}
    >
      <h3 className="mb-4 text-green-400">Controls</h3>
      
      {/* Sliders */}
      <div className="flex flex-col gap-3 mb-4">
        <div>
          <label className="text-sm text-green-400">Plants: {plantsNum}</label>
          <input 
            type="range" 
            min="0" 
            max="20" 
            value={plantsNum}
            onChange={(e) => setPlantsNum(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm text-green-400">Rabbits: {rabbitsNum}</label>
          <input 
            type="range" 
            min="0" 
            max="15" 
            value={rabbitsNum}
            onChange={(e) => setRabbitsNum(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm text-green-400">Foxes: {foxesNum}</label>
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={foxesNum}
            onChange={(e) => setFoxesNum(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm text-green-400">Grid Size: {gridSize}x{gridSize}</label>
          <input 
            type="range" 
            min="3" 
            max="15" 
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={handleResetEcosystem}
          className="p-2 bg-red-700 text-white border border-red-500 rounded cursor-pointer font-mono hover:bg-red-600"
        >
          Reset Ecosystem
        </button>
        <button 
          onClick={handleStartSimulation}
          className="p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600">
          Start Simulation
        </button>
        <button 
          onClick={handlePauseSimulation}
          className="p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600">
          Pause Simulation
        </button>
      </div>
    </div>
  );
}
