// components/AdderBox.js
import { useState } from "react";

export default function AdderBox({ socket, gridSize }) {

  // add routes
  const handleAddGrass = async() => {
    await fetch(`/api/entities/addGrass`, { 
      method: "POST" ,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gridSize }),
    });
  };

  const handleAddRabbit = async() => {
    await fetch(`/api/entities/addRabbit`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gridSize }),
    });
  };

  const handleAddFox = async() => {
    await fetch(`/api/entities/addFox`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gridSize }),
    });
  };

  // get routes
  const handleGetGrass = async() => {
    await fetch(`/api/entities/getGrass`, { method: "GET" });
  };

  const handleGetRabbit = async() => {
    await fetch(`/api/entities/getRabbit`, { method: "GET" });
  };

  const handleGetFox = async() => {
    await fetch(`/api/entities/getFox`, { method: "GET" });
  };

  const handleGetEnvironment = async() => {
    await fetch(`/api/environment/getEnvironment`, { method: "GET" });
  };

  // delete routes
  const handleDeleteGrass = async() => {
    await fetch(`/api/entities/deleteGrass`, { 
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gridSize }),
    });
  };

  const handleDeleteRabbit = async() => {
    await fetch(`/api/entities/deleteRabbit`, { 
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gridSize }),
    });
  };

  const handleDeleteFox = async() => {
    await fetch(`/api/entities/deleteFox`, { 
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gridSize }),
    });
  };

  // feed routes
  const handleFeedGrass = async() => {
    await fetch(`/api/entities/feedGrass`, { method: "PATCH" });
  };

  const handleFeedRabbit = async() => {
    await fetch(`/api/entities/feedRabbit`, { method: "PATCH" });
  };

  const handleFeedFox = async() => {
    await fetch(`/api/entities/feedFox`, { method: "PATCH" });
  };

  return (
    <div className="p-4 bg-white text-white rounded shadow-lg border-4 border-black w-full flex-shrink-0">
      <h2 className="mb-4 text-black font-bold">Add Entities</h2>
      
      <div className="flex flex-row gap-2">
        {/* add buttons */}
        <button 
          onClick={handleAddGrass}
          className="flex-1 p-2 bg-green-700 text-white border border-green-500 rounded cursor-pointer font-mono hover:bg-green-600"
        >
          Add Grass
        </button>
        <button 
          onClick={handleAddRabbit}
          className="flex-1 p-2 bg-green-700 text-white border border-green-500 rounded cursor-pointer font-mono hover:bg-green-600"
        >
          Add Rabbit
        </button>
        <button 
          onClick={handleAddFox}
          className="flex-1 p-2 bg-green-700 text-white border border-green-500 rounded cursor-pointer font-mono hover:bg-green-600"
        >
          Add Fox
        </button>
        {/* get buttons */}
        <button 
          onClick={handleGetGrass}
          className="flex-1 p-2 bg-yellow-700 text-white border border-yellow-500 rounded cursor-pointer font-mono hover:bg-yellow-600"
        >
          Get Grass
        </button>
        <button 
          onClick={handleGetRabbit}
          className="flex-1 p-2 bg-yellow-700 text-white border border-yellow-500 rounded cursor-pointer font-mono hover:bg-yellow-600"
        >
          Get Rabbit
        </button>
        <button 
          onClick={handleGetFox}
          className="flex-1 p-2 bg-yellow-700 text-white border border-yellow-500 rounded cursor-pointer font-mono hover:bg-yellow-600"
        >
          Get Fox
        </button>
        <button 
          onClick={handleGetEnvironment}
          className="flex-1 p-2 bg-yellow-700 text-white border border-yellow-500 rounded cursor-pointer font-mono hover:bg-yellow-600"
        >
          Get Environment
        </button>
        {/* delete buttons */}
        <button 
          onClick={handleDeleteGrass}
          className="flex-1 p-2 bg-red-700 text-white border border-red-500 rounded cursor-pointer font-mono hover:bg-red-600"
        >
          Delete Grass
        </button>
        <button 
          onClick={handleDeleteRabbit}
          className="flex-1 p-2 bg-red-700 text-white border border-red-500 rounded cursor-pointer font-mono hover:bg-red-600"
        >
          Delete Rabbit
        </button>
        <button 
          onClick={handleDeleteFox}
          className="flex-1 p-2 bg-red-700 text-white border border-red-500 rounded cursor-pointer font-mono hover:bg-red-600"
        >
          Delete Fox
        </button>
        {/* feed buttons */}
        <button 
          onClick={handleFeedGrass}
          className="flex-1 p-2 bg-blue-700 text-white border border-blue-500 rounded cursor-pointer font-mono hover:bg-blue-600"
        >
          Feed Grass
        </button>
        <button 
          onClick={handleFeedRabbit}
          className="flex-1 p-2 bg-blue-700 text-white border border-blue-500 rounded cursor-pointer font-mono hover:bg-blue-600"
        >
          Feed Rabbit
        </button>
        <button 
          onClick={handleFeedFox}
          className="flex-1 p-2 bg-blue-700 text-white border border-blue-500 rounded cursor-pointer font-mono hover:bg-blue-600"
        >
          Feed Fox
        </button>
      </div>
    </div>
  );
}
