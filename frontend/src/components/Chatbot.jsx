import { useState, useRef, useEffect } from "react";
import { PaperClipIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Chatbot({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!input && !file) return;

    if (input) {
      setMessages((prev) => [...prev, { type: "user", text: input }]);
    }

    if (file) {
      setMessages((prev) => [
        ...prev,
        { type: "user", text: `Uploaded file: ${file.name}` },
      ]);
      setFile(null);
    }

    setInput("");

    // Mock LLM response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "llm", text: "This is a response from the LLM." },
      ]);
    }, 1000);
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
              {msg.type === "llm" && msg.text}

              {msg.type === "llm_table" && (
                <table className="min-w-full text-sm border border-gray-300">
                  <thead>
                    <tr>
                      {Object.keys(msg.data[0] || {}).map((col) => (
                        <th
                          key={col}
                          className="border border-gray-300 px-2 py-1 bg-gray-100"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {msg.data.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td
                            key={j}
                            className="border border-gray-300 px-2 py-1"
                            contentEditable
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2">
        <label className="p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
          <PaperClipIcon className="w-5 h-5 text-gray-600" />
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

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
