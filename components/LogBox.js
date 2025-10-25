// components/LogBox.js
import { useEffect, useRef } from "react";

export default function LogBox({ logs, height = "h-[28rem]" }) {
  const endRef = useRef(null);

  // Scroll to bottom when logs change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div
      className={`p-4 bg-white text-black rounded shadow-lg ${height} overflow-y-auto border-4 border-black w-full flex-shrink-0`}
    >
      <h2 className="mb-4 text-black font-bold">Logs:</h2>
      {logs.map((log, index) => (
        <div key={index} className="px-1">
          {log}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
