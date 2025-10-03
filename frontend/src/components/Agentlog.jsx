import { useState, useEffect, useRef } from "react";
import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

// Module-level store to persist logs across component mounts
let sessionLogs = [];

export default function AgentLog() {
  const logsRef = useRef(sessionLogs); // persistent across unmounts
  const [logs, setLogs] = useState([...logsRef.current]);
  const [highlighted, setHighlighted] = useState(new Set()); // track highlighted log indices
  const logEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [logs]);

  // Function to start SSE connection
  const startSSE = () => {
    const es = new EventSource("http://localhost:8000/logs/stream/");
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const message = `[${new Date().toLocaleString()}] ${event.data}`;
      logsRef.current.push(message);
      sessionLogs.push(message);

      const newIndex = logsRef.current.length - 1;
      setLogs([...logsRef.current]);
      setHighlighted((prev) => new Set(prev).add(newIndex));

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlighted((prev) => {
          const updated = new Set(prev);
          updated.delete(newIndex);
          return updated;
        });
      }, 3000);
    };

    es.onerror = () => {
      console.error("SSE error, reconnecting...");
      es.close();
      setTimeout(startSSE, 2000); // reconnect after 2 seconds
    };
  };

  useEffect(() => {
    startSSE();
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  // Export logs as TXT
  const handleExportLogs = () => {
    if (logsRef.current.length === 0) return;
    const element = document.createElement("a");
    const file = new Blob([logsRef.current.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "agent_logs.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Refresh logs manually
  const handleRefreshLogs = () => {
    setLogs([...sessionLogs]);
    setHighlighted(new Set()); // clear highlights
  };

  return (
    <div className="w-full h-[80vh] flex flex-col">
      {/* Buttons */}
      <div className="mb-2 flex justify-end gap-2">
        <button
          onClick={handleRefreshLogs}
          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Refresh Logs
        </button>
        <button
          onClick={handleExportLogs}
          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Export Logs
        </button>
      </div>

      {/* Terminal */}
      <div className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 overflow-y-auto rounded-lg">
        {logs.length === 0 ? (
          <div>Awaiting logs...</div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`mb-1 transition-colors duration-1000 ${
                highlighted.has(index)
                  ? "bg-green-800 text-white rounded px-1"
                  : ""
              }`}
            >
              {log}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
