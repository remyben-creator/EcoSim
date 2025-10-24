// components/ControlBox.js

export default function ControlBox() {
  return (
    <div className="p-4 bg-gray-900 text-white font-mono rounded shadow-lg border-black min-h-52"
      style={{
        border: "3px solid black",
        width: "400px",
        boxSizing: "border-box",
      }}
    >
      <h3 className="mb-4 text-green-400">Controls</h3>
      <div className="flex flex-col gap-2">
        <button className="p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600">
          Start Simulation
        </button>
        <button className="p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600">
          Pause Simulation
        </button>
        <button className="p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600">
          Reset Ecosystem
        </button>
        <button className="p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600">
          Add Animals
        </button>
        <button className="p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600">
          Change Grid Size
        </button>
      </div>
    </div>
  );
}
