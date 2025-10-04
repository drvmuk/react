import React, { useState, useRef, useEffect } from "react";
import { PaperClipIcon, ArrowRightIcon, ArrowPathIcon, DocumentTextIcon, PlusSmallIcon, TrashIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon, ComputerDesktopIcon } from "@heroicons/react/24/solid";

export default function Chatbot({ onTableProceed }) {
  const [messages, setMessages] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("chatMessages")) || [];
    return saved.map(msg => ({ ...msg, sender: msg.sender || 'Agent' }));
  });
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [chatEndRef, setChatEndRef] = useState(null);

  const scrollToBottom = () => {
    chatEndRef?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    window.addChatMessage = ({ text, sender = 'Agent', table }) => {
      setMessages(prev => [...prev, { text, sender, type: 'llm', table, editable: !!table }]);
    };
    return () => { window.addChatMessage = null; };
  }, []);

  const handleSend = () => {
    if (!input && !file) return;
    if (input) setMessages(prev => [...prev, { type: "user", text: input, sender: "User" }]);
    if (file) {
      setMessages(prev => [...prev, { type: "user", text: `Uploaded file: ${file.name}`, sender: "User" }]);
      setFile(null);
    }
    setInput("");
  };

  const handleRefresh = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  const handleExport = () => {
    const chatText = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chat_export.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getAvatar = (sender) => (
    <div className="avatar">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2">
        {sender === "User" ? <UserCircleIcon className="w-6 h-6 text-blue-500" /> : <ComputerDesktopIcon className="w-6 h-6 text-gray-700" />}
      </div>
    </div>
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const updateCell = (msgIndex, rowIndex, colKey, value) => {
    setMessages(prev => {
      const newMsgs = [...prev];
      newMsgs[msgIndex].table[rowIndex][colKey] = value;
      return newMsgs;
    });
  };

  const addRow = (msgIndex) => {
    setMessages(prev => {
      const newMsgs = [...prev];
      const keys = Object.keys(newMsgs[msgIndex].table[0]);
      const newRow = keys.reduce((acc, k) => ({ ...acc, [k]: '' }), {});
      newMsgs[msgIndex].table.push(newRow);
      return newMsgs;
    });
  };

  const deleteRow = (msgIndex, rowIndex) => {
    setMessages(prev => {
      const newMsgs = [...prev];
      newMsgs[msgIndex].table.splice(rowIndex, 1);
      return newMsgs;
    });
  };

  const proceedTable = (msgIndex) => {
    const modifiedTable = messages[msgIndex].table;
    console.log("Modified Table (Chatbot):", modifiedTable);

    // Call global callback
    if (window.onTableProceed) {
      window.onTableProceed(modifiedTable);
    }

    setMessages(prev => {
      const newMsgs = [...prev];
      newMsgs[msgIndex].editable = false;
      return newMsgs;
    });
  };

  const cancelTable = (msgIndex) => {
    setMessages(prev => {
      const newMsgs = [...prev];
      newMsgs[msgIndex].editable = false;
      return newMsgs;
    });
  };

  const renderEditableTable = (msg, idx) => (
    <div className="overflow-x-auto mt-2 border p-2 rounded bg-white shadow-sm">
      <table className="min-w-full border border-gray-300 text-sm table-auto rounded">
        <thead className="bg-gray-100">
          <tr>{Object.keys(msg.table[0]).map((col, i) => <th key={i} className="px-4 py-2 border text-left font-medium text-gray-700">{col}</th>)}</tr>
        </thead>
        <tbody>
          {msg.table.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-gray-50">
              {Object.entries(row).map(([colKey, val], cIdx) => (
                <td key={cIdx} className="px-2 py-1 border">
                  <input type="text" value={val} onChange={e => updateCell(idx, rIdx, colKey, e.target.value)}
                    className="w-full px-1 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </td>
              ))}
              <td className="px-2 py-1 border flex justify-center">
                <button onClick={() => deleteRow(idx, rIdx)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-2 justify-end">
        <button onClick={() => addRow(idx)} className="p-1 bg-green-500 text-white rounded hover:bg-green-600">
          <PlusSmallIcon className="w-5 h-5" />
        </button>
        <button onClick={() => proceedTable(idx)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Proceed</button>
        <button onClick={() => cancelTable(idx)} className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  );

  const renderTableBubble = (table) => (
    <div className="overflow-x-auto mt-2 border p-2 rounded bg-white shadow-sm">
      <table className="min-w-full border border-gray-300 text-sm table-auto rounded">
        <thead className="bg-gray-100">
          <tr>{Object.keys(table[0]).map((col, i) => <th key={i} className="px-4 py-2 border text-left font-medium text-gray-700">{col}</th>)}</tr>
        </thead>
        <tbody>
          {table.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-gray-50">
              {Object.entries(row).map(([colKey, val], cIdx) => (
                <td key={cIdx} className="px-2 py-1 border text-gray-700">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col h-[80vh] bg-gray-100 rounded-lg shadow-lg p-4 border border-gray-300">
      <div className="flex justify-end gap-2 mb-2">
        <button onClick={handleRefresh} className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">
          <ArrowPathIcon className="w-4 h-4" /> Refresh
        </button>
        <button onClick={handleExport} className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">
          <DocumentTextIcon className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 && <div className="text-gray-500">Start the conversation...</div>}
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-start max-w-xs ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {getAvatar(msg.sender)}
              <div className={`px-4 py-2 rounded-lg ${msg.type === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"}`}>
                <strong>{msg.sender}</strong>
                <div className="mt-1">{msg.text}</div>
                {msg.table && msg.editable ? renderEditableTable(msg, idx) : msg.table && renderTableBubble(msg.table)}
              </div>
            </div>
          </div>
        ))}
        <div ref={el => setChatEndRef(el)} />
      </div>

      <div className="flex items-center gap-2">
        <label className="p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
          <PaperClipIcon className="w-5 h-5 text-gray-600" />
          <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
        </label>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
