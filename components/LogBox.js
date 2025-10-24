// components/LogBox.js
import { useEffect, useRef } from "react";

export default function LogBox({ logs, height = "28rem" }) {
  const endRef = useRef(null);

  // Scroll to bottom when logs change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div
      className="p-4 bg-gray-900 text-green-400 font-mono rounded shadow-lg"
      style={{
        height,
        overflowY: "auto",
        border: "3px solid black",
        width: "400px", // Fixed width
        flexShrink: 0, // Don't shrink
      }}
    >
      {logs.map((log, index) => (
        <div key={index} style={{ padding: "0 0.25rem" }}>
          {log}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
