// src/pages/AgenticIngestion.js
import { useState } from "react";
import Chatbot from "../components/Chatbot";
import AgentLog from "../components/Agentlog";
import LeftPanel from "../components/LeftPanel";
import { ChatBubbleBottomCenterIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";

export default function AgenticIngestion() {
  const [activeTab, setActiveTab] = useState("chatbot");

  return (
    <div className="flex h-screen">
      {/* Left half: Accordion Stepper */}
      <div className="w-1/2">
        <LeftPanel />
      </div>

      {/* Right half */}
      <div className="w-1/2 bg-gray-100 p-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-300">
          <button
            className={`flex items-center px-4 py-2 font-semibold ${
              activeTab === "chatbot"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("chatbot")}
          >
            <ChatBubbleBottomCenterIcon className="w-5 h-5 mr-2" />
            Chatbot
          </button>

          <button
            className={`flex items-center px-4 py-2 font-semibold ${
              activeTab === "agentlog"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("agentlog")}
          >
            <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
            Agent Log
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "agentlog" && <AgentLog />}
          {activeTab === "chatbot" && <Chatbot />}
        </div>
      </div>
    </div>
  );
}
