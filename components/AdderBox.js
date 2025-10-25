// components/AdderBox.js
import { useState } from "react";

export default function AdderBox({ socket }) {
  const handleAddGrass = () => {
    if (socket) {
      socket.emit("addGrass");
    }
  };

  const handleAddRabbit = () => {
    if (socket) {
      socket.emit("addRabbit");
    }
  };

  const handleAddFox = () => {
    if (socket) {
      socket.emit("addFox");
    }
  };

  return (
    <div className="p-4 bg-white text-white rounded shadow-lg border-4 border-black w-full flex-shrink-0">
      <h2 className="mb-4 text-black font-bold">Add Entities</h2>
      
      <div className="flex flex-row gap-2">
        <button 
          onClick={handleAddGrass}
          className="flex-1 p-2 bg-green-700 text-white border border-green-500 rounded cursor-pointer font-mono hover:bg-green-600"
        >
          Add Grass
        </button>
        <button 
          onClick={handleAddRabbit}
          className="flex-1 p-2 bg-blue-700 text-white border border-blue-500 rounded cursor-pointer font-mono hover:bg-blue-600"
        >
          Add Rabbit
        </button>
        <button 
          onClick={handleAddFox}
          className="flex-1 p-2 bg-yellow-700 text-white border border-yellow-500 rounded cursor-pointer font-mono hover:bg-yellow-600"
        >
          Add Fox
        </button>
      </div>
    </div>
  );
}
