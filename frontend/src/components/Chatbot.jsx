import { useState, useRef, useEffect } from "react";
import { PaperClipIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Chatbot() {
  const [messages, setMessages] = useState([]); // messages from backend + user
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Fetch messages from backend periodically or on demand
  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/agents/get-chat-messages/");
      const data = await res.json();
      // Expect data.messages = [{ type: 'text'|'table', text?, data? }]
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages(); // fetch once at start
    // Optionally, poll every 5s for new messages
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input && !file) return;

    // Send user message to backend
    const userMessage = { type: "text", text: input || `Uploaded file: ${file?.name}` };
    setMessages((prev) => [...prev, { ...userMessage, type: "user" }]);

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (file) formData.append("file", file);

      await fetch("http://localhost:8000/api/agents/send-chat-message/", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }

    setInput("");
    setFile(null);
    fetchMessages(); // fetch updated messages after sending
  };

  return (
    <div className="flex flex-col h-[80vh] bg-gray-100 rounded-lg shadow-lg p-4 border border-gray-300">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <div className="text-gray-500">Start the conversation...</div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.type === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {/* Generic handling */}
              {msg.type === "text" || msg.type === "llm" ? (
                msg.text
              ) : msg.type === "table" || msg.type === "llm_table" ? (
                <div>
                  {msg.text && <div className="font-semibold mb-2">{msg.text}</div>}
                  {Array.isArray(msg.data) && msg.data.length > 0 ? (
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr>
                          {Object.keys(msg.data[0]).map((col, i) => (
                            <th key={i} className="border px-2 py-1 bg-gray-200">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.data.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="border px-2 py-1" contentEditable>
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-gray-500 italic">No data available</div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 italic">Unsupported message type</div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2">
        {/* File upload */}
        <label className="p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
          <PaperClipIcon className="w-5 h-5 text-gray-600" />
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Text input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
