// components/ControlBox.js
import { useState } from "react";

export default function ControlBox({ socket }) {
  const [plantsNum, setPlantsNum] = useState(5);
  const [rabbitsNum, setRabbitsNum] = useState(5);
  const [foxesNum, setFoxesNum] = useState(2);
  const [gridSize, setGridSize] = useState(5);

  const handleResetEcosystem = async() => {
    await fetch(`/api/environment/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plantsNum, rabbitsNum, foxesNum, gridSize }),
    });
  };

  const handleStartSimulation = async() => {
    await fetch(`/api/environment/start`, { method: "POST" });
  };

  const handlePauseSimulation = async() => {
    await fetch(`/api/environment/pause`, { method: "POST" });
  };

  return (
    <div className="p-4 bg-white text-white rounded shadow-lg min-h-52 border-4 border-black w-full flex-shrink-0">
      <h2 className="mb-4 text-black font-bold">Controls</h2>
      
      {/* Sliders */}
      <div className="flex flex-col gap-3 mb-4">
        <div>
          <label className="text-sm text-black">Plants: {plantsNum}</label>
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
          <label className="text-sm text-black">Rabbits: {rabbitsNum}</label>
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
          <label className="text-sm text-black">Foxes: {foxesNum}</label>
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
          <label className="text-sm text-black">Grid Size: {gridSize}x{gridSize}</label>
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
          className="p-2 bg-green-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-green-600">
          Start Simulation
        </button>
        <button 
          onClick={handlePauseSimulation}
          className="p-2 bg-yellow-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-yellow-600">
          Pause Simulation
        </button>
      </div>
    </div>
  );
}
