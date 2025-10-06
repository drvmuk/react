// import { useState, useEffect } from "react";
// import {
//   MagnifyingGlassIcon,
//   CubeIcon,
//   DocumentDuplicateIcon,
//   ArrowDownTrayIcon,
//   ShieldCheckIcon,
//   ArrowsRightLeftIcon,
//   DocumentArrowUpIcon,
//   TableCellsIcon,
//   UserIcon,
//   RocketLaunchIcon,
// } from "@heroicons/react/24/outline";

// // Map API icon strings to HeroIcons
// const iconMapping = {
//   MagnifyingGlassIcon,
//   CubeIcon,
//   DocumentDuplicateIcon,
//   ArrowDownTrayIcon,
//   ShieldCheckIcon,
//   ArrowsRightLeftIcon,
//   DocumentArrowUpIcon,
//   TableCellsIcon,
// };

// export default function LeftPanel() {
//   const [steps, setSteps] = useState([]);
//   const [openStep, setOpenStep] = useState(null);
//   const [showFileModal, setShowFileModal] = useState(false);
//   const [showTableModal, setShowTableModal] = useState(false);
//   const [filePath, setFilePath] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [tableName, setTableName] = useState("");
//   const [progressPercentage, setProgressPercentage] = useState(0);
//   const [executionMode, setExecutionMode] = useState(
//     localStorage.getItem("executionMode") || null
//   );

//   // Fetch steps from Django API
//   const fetchSteps = () => {
//     fetch("http://localhost:8000/api/agents/")
//       .then((res) => res.json())
//       .then((data) => {
//         setSteps(data);
//         if (data.length) {
//           const completed = data.filter((s) => s.status === "completed").length;
//           setProgressPercentage(Math.round((completed / data.length) * 100));
//         }
//       })
//       .catch((err) => console.error("Error fetching agents:", err));
//   };

//   useEffect(() => fetchSteps(), []);

//   const getStepColor = (status) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 border-green-300 text-green-700";
//       case "running":
//         return "bg-yellow-100 border-yellow-300 text-yellow-700";
//       case "pending":
//       default:
//         return "bg-gray-100 border-gray-300 text-gray-700";
//     }
//   };

//   const handleFileUpload = () => {
//     if (!filePath || !selectedFile) {
//       alert("Provide both a file path and select a file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file_path", filePath);
//     formData.append("file", selectedFile);

//     fetch("http://localhost:8000/api/agents/data-discovery/", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then(() => {
//         fetchSteps();
//         if (executionMode === "autonomous") {
//           fetch("http://localhost:8000/api/agents/start-flow/", {
//             method: "POST",
//           }).then(() => fetchSteps());
//         }
//       })
//       .catch((err) => console.error("Error triggering Data Discovery:", err));

//     setShowFileModal(false);
//     setFilePath("");
//     setSelectedFile(null);
//   };

//   const handleTableIngestion = () => {
//     console.log("Ingesting table:", tableName);
//     setShowTableModal(false);
//     setTableName("");
//   };

//   const handleModeSelect = (mode) => {
//     setExecutionMode(mode);
//     localStorage.setItem("executionMode", mode);
//     fetch("http://localhost:8000/api/agents/set-mode/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mode }),
//     })
//       .then((res) => res.json())
//       .then((data) => console.log("Execution mode set:", data))
//       .catch((err) => console.error("Error setting execution mode:", err));
//   };

//   return (
//     <div className="w-full h-full p-4 overflow-y-auto bg-gray-50">
//       {/* Progress Bar with percentage */}
//       <div className="mb-4">
//         <div className="text-sm font-medium text-gray-700 mb-1 flex justify-between">
//           <span>
//             {progressPercentage === 0
//               ? "Initiate Process"
//               : progressPercentage === 100
//               ? "Process Completed"
//               : "Process Running"}
//           </span>
//           <span>{progressPercentage}%</span>
//         </div>
//         <div className="w-full bg-gray-200 h-3 rounded-full">
//           <div
//             className="bg-green-500 h-3 rounded-full transition-all duration-500"
//             style={{ width: `${progressPercentage}%` }}
//           ></div>
//         </div>
//       </div>

//       {/* Execution Mode Icon */}
//       {executionMode && (
//         <div className="mb-4 flex items-center gap-2">
//           {executionMode === "human" && <UserIcon className="w-5 h-5 text-blue-600" />}
//           {executionMode === "autonomous" && <RocketLaunchIcon className="w-5 h-5 text-green-600" />}
//           <span className="text-sm font-medium text-gray-700">
//             {executionMode === "human" ? "Human in the Loop" : "Autonomous"}
//           </span>
//         </div>
//       )}

//       {/* Top Tiles */}
//       <div className="flex gap-4 mb-6">
//         <div
//           className="flex-1 p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
//           onClick={() => setShowFileModal(true)}
//         >
//           <DocumentArrowUpIcon className="w-6 h-6" />
//           <span className="font-medium">File Upload</span>
//         </div>
//         <div
//           className="flex-1 p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
//           onClick={() => setShowTableModal(true)}
//         >
//           <TableCellsIcon className="w-6 h-6" />
//           <span className="font-medium">Table Ingestion</span>
//         </div>
//       </div>

//       <hr className="w-full h-1 my-4 bg-gray-100 border-0 rounded-sm" />

//       {/* Accordion steps */}
//       <div className="space-y-4">
//         {steps.length === 0 ? (
//           <div className="text-gray-500">Loading steps...</div>
//         ) : (
//           steps.map((step) => {
//             const isOpen = openStep === step.id;
//             const colorClass = getStepColor(step.status);
//             const IconComponent = iconMapping[step.icon];

//             return (
//               <div
//                 key={step.id}
//                 className={`w-full p-4 rounded-lg border cursor-pointer ${colorClass}`}
//                 onClick={() => setOpenStep(isOpen ? null : step.id)}
//               >
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     {IconComponent && <IconComponent className="w-5 h-5" />}
//                     <h3 className="font-medium flex items-center gap-1">
//                       {step.title}
//                       {step.status === "running" && (
//                         <svg
//                           className="animate-spin h-4 w-4 text-yellow-500"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                           ></path>
//                         </svg>
//                       )}
//                     </h3>
//                   </div>
//                   <svg
//                     className={`w-4 h-4 transform transition-transform duration-200 ${
//                       isOpen ? "rotate-90" : ""
//                     }`}
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 16 16"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M4 6l4 4 4-4"
//                     />
//                   </svg>
//                 </div>
//                 {isOpen && <div className="mt-2 text-sm text-gray-700">{step.content || "Loading..."}</div>}
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* File Upload Modal */}
//       {showFileModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
//             <h3 className="text-lg font-semibold mb-4">File Upload</h3>
//             <input
//               type="text"
//               placeholder="Enter destination file path"
//               value={filePath}
//               onChange={(e) => setFilePath(e.target.value)}
//               className="w-full p-2 border rounded mb-4"
//             />
//             <input
//               type="file"
//               onChange={(e) => setSelectedFile(e.target.files[0])}
//               className="w-full mb-4"
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowFileModal(false)}
//                 className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleFileUpload}
//                 className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Upload & Run
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Table Ingestion Modal */}
//       {showTableModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
//             <h3 className="text-lg font-semibold mb-4">Table Ingestion</h3>
//             <input
//               type="text"
//               placeholder="Enter table name"
//               value={tableName}
//               onChange={(e) => setTableName(e.target.value)}
//               className="w-full p-2 border rounded mb-4"
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowTableModal(false)}
//                 className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleTableIngestion}
//                 className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Ingest
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  CubeIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  DocumentArrowUpIcon,
  TableCellsIcon,
  UserIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

// Map API icon strings to HeroIcons
const iconMapping = {
  MagnifyingGlassIcon,
  CubeIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  DocumentArrowUpIcon,
  TableCellsIcon,
};

export default function LeftPanel() {
  const [steps, setSteps] = useState([]);
  const [openStep, setOpenStep] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableName, setTableName] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [executionMode, setExecutionMode] = useState(
    localStorage.getItem("executionMode") || null
  );

  // 🔥 Helper: set a step status locally (running immediately after API call)
  const setStepStatus = (stepTitle, status) => {
    setSteps((prevSteps) =>
      prevSteps.map((s) =>
        s.title === stepTitle ? { ...s, status } : s
      )
    );
  };

  // Check pipeline status code
// Reusable pipeline status checker
const checkPipelineStatus = async () => {
  let status = "Running";

  while (["Running", "In Progress"].includes(status)) {
    try {
      const res = await fetch("http://localhost:8000/api/fabric-pipeline-status/");
      const data = await res.json();
      status = data.status;
      console.log("Pipeline status:", status);

      if (["Running", "In Progress"].includes(status)) {
        // Wait 30 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    } catch (err) {
      console.error("Error checking pipeline status:", err);
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }

  return status;
};

// Main upload + trigger function
const handleFileUpload = async () => {
  if (!filePath || !selectedFile) {
    alert("Provide both a file path and select a file.");
    return;
  }

  const formData = new FormData();
  formData.append("file_path", filePath);
  formData.append("file", selectedFile);

  try {
    // Trigger pipeline
    await fetch("http://localhost:8000/api/agents/data-discovery/", {
      method: "POST",
      body: formData,
    });

    fetchSteps();

    // Wait until pipeline finishes
    const finalStatus = await checkPipelineStatus();

    if (finalStatus === "Completed") {
      console.log("Pipeline completed!");

      if (window.addChatMessage) {
        window.addChatMessage({
          type: "llm",
          text: "Data discovered. Please review the table.",
          table: [
            { Name: "Alice", Age: 30, Role: "Engineer" },
            { Name: "Bob", Age: 25, Role: "Analyst" }
          ]
        });
      }

      // On proceed from chatbot
      window.onTableProceed = (modifiedTable) => {
        console.log("Modified Table received in LeftPanel:", modifiedTable);

        fetch("http://localhost:8000/api/agents/next-step/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table: modifiedTable }),
        })
          .then(res => res.json())
          .then(data => console.log("Next step API response:", data));
      };

    } else if (["Failed", "Cancelled"].includes(finalStatus)) {
      alert(`Pipeline ${finalStatus}. Please check logs.`);
    }
  } catch (err) {
    console.error("Error triggering Data Discovery:", err);
  }

  setShowFileModal(false);
  setFilePath("");
  setSelectedFile(null);
};


  // Fetch steps from Django API
  const fetchSteps = () => {
    fetch("http://localhost:8000/api/agents/")
      .then((res) => res.json())
      .then((data) => {
        setSteps(data);
        if (data.length) {
          const completed = data.filter((s) => s.status === "completed").length;
          setProgressPercentage(Math.round((completed / data.length) * 100));
        }
      })
      .catch((err) => console.error("Error fetching agents:", err));
  };

  useEffect(() => fetchSteps(), []);

  const getStepColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-300 text-green-700";
      case "running":
        return "bg-yellow-100 border-yellow-300 text-yellow-700";
      case "pending":
      default:
        return "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  const handleFileUpload = () => {
    if (!filePath || !selectedFile) {
      alert("Provide both a file path and select a file.");
      return;
    }

    setStepStatus("Data Discovery", "running");

    const formData = new FormData();
    formData.append("file_path", filePath);
    formData.append("file", selectedFile);

    fetch("http://localhost:8000/api/agents/data-discovery/", {
      method: "POST",
      body: formData,
    })
    .then(res => res.json())
    .then(() => {
      fetchSteps();

      // Send table to Chatbot
      if (window.addChatMessage) {
        window.addChatMessage({
          type: "llm",
          text: "Data discovered. Please review the table.",
          table: [
            { Name: "Alice", Age: 30, Role: "Engineer" },
            { Name: "Bob", Age: 25, Role: "Analyst" }
          ]
        });
      }

      // Save a global callback for Chatbot to call
      window.onTableProceed = (modifiedTable) => {
        console.log("Modified Table received in LeftPanel:", modifiedTable);

        // Now call next API
        fetch("http://localhost:8000/api/agents/next-step/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table: modifiedTable }),
        })
        .then(res => res.json())
        .then(data => console.log("Next step API response:", data));
      };
    })
    .catch(err => console.error("Error triggering Data Discovery:", err));

    setShowFileModal(false);
    setFilePath("");
    setSelectedFile(null);
  };


  const handleTableIngestion = () => {
    // 🔥 Immediately mark Table Ingestion as running
    setStepStatus("Table Ingestion", "running");

    console.log("Ingesting table:", tableName);
    fetch("http://localhost:8000/api/agents/table-ingest/", {
      method: "POST",
      body: JSON.stringify({ table_name: tableName }),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => fetchSteps())
      .catch((err) => console.error("Error ingesting table:", err));

    setShowTableModal(false);
    setTableName("");
  };

  const handleModeSelect = (mode) => {
    setExecutionMode(mode);
    localStorage.setItem("executionMode", mode);
    fetch("http://localhost:8000/api/agents/set-mode/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Execution mode set:", data))
      .catch((err) => console.error("Error setting execution mode:", err));
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-gray-50">
      {/* Progress Bar with percentage */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-1 flex justify-between">
          <span>
            {progressPercentage === 0
              ? "Initiate Process"
              : progressPercentage === 100
              ? "Process Completed"
              : "Process Running"}
          </span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Execution Mode Icon */}
      {executionMode && (
        <div className="mb-4 flex items-center gap-2">
          {executionMode === "human" && <UserIcon className="w-5 h-5 text-blue-600" />}
          {executionMode === "autonomous" && <RocketLaunchIcon className="w-5 h-5 text-green-600" />}
          <span className="text-sm font-medium text-gray-700">
            {executionMode === "human" ? "Human in the Loop" : "Autonomous"}
          </span>
        </div>
      )}

      {/* Top Tiles */}
      <div className="flex gap-4 mb-6">
        <div
          className="flex-1 p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
          onClick={() => setShowFileModal(true)}
        >
          <DocumentArrowUpIcon className="w-6 h-6" />
          <span className="font-medium">File Upload</span>
        </div>
        <div
          className="flex-1 p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
          onClick={() => setShowTableModal(true)}
        >
          <TableCellsIcon className="w-6 h-6" />
          <span className="font-medium">Table Ingestion</span>
        </div>
      </div>

      <hr className="w-full h-1 my-4 bg-gray-100 border-0 rounded-sm" />

      {/* Accordion steps */}
      <div className="space-y-4">
        {steps.length === 0 ? (
          <div className="text-gray-500">Loading steps...</div>
        ) : (
          steps.map((step) => {
            const isOpen = openStep === step.id;
            const colorClass = getStepColor(step.status);
            const IconComponent = iconMapping[step.icon];

            return (
              <div
                key={step.id}
                className={`w-full p-4 rounded-lg border cursor-pointer ${colorClass}`}
                onClick={() => setOpenStep(isOpen ? null : step.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <h3 className="font-medium flex items-center gap-1">
                      {step.title}
                      {step.status === "running" && (
                        <svg
                          className="animate-spin h-4 w-4 text-yellow-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      )}
                    </h3>
                  </div>
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6l4 4 4-4"
                    />
                  </svg>
                </div>
                {isOpen && <div className="mt-2 text-sm text-gray-700">{step.content || "Loading..."}</div>}
              </div>
            );
          })
        )}
      </div>

      {/* File Upload Modal */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">File Upload</h3>
            <input
              type="text"
              placeholder="Enter destination file path"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFileModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Upload & Run
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Ingestion Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Table Ingestion</h3>
            <input
              type="text"
              placeholder="Enter table name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleTableIngestion}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Ingest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
