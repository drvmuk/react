import { useState } from "react";
import { FolderIcon, DocumentIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

// Placeholder project structure with sample code
const placeholderFiles = [
  { 
    name: "main.py", 
    type: "file", 
    code: `# main.py\n\ndef main():\n    print("Hello from main.py")\n\nif __name__ == "__main__":\n    main()` 
  },
  { 
    name: "utils.py", 
    type: "file", 
    code: `# utils.py\n\ndef add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b` 
  },
  { 
    name: "sql_queries.sql", 
    type: "file", 
    code: `-- sql_queries.sql\n\nSELECT * FROM users;\nINSERT INTO orders VALUES (1, 'order1');` 
  },
  { 
    name: "components", 
    type: "folder", 
    children: [
      { 
        name: "Chatbot.js", 
        type: "file", 
        code: `// Chatbot.js\n\nfunction Chatbot() {\n  console.log("Chatbot placeholder");\n}` 
      },
      { 
        name: "AgentLog.js", 
        type: "file", 
        code: `// AgentLog.js\n\nfunction AgentLog() {\n  console.log("Agent Log placeholder");\n}` 
      },
    ]
  }
];

// Recursive FileTree component
function FileTree({ files, onSelectFile }) {
  return (
    <ul className="space-y-1 text-sm">
      {files.map((file, idx) => (
        <li key={idx} className="flex flex-col ml-2">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
            onClick={() => file.type === "file" && onSelectFile(file)}
          >
            {file.type === "folder" ? (
              <FolderIcon className="w-4 h-4" />
            ) : (
              <DocumentIcon className="w-4 h-4" />
            )}
            {file.name}
          </div>
          {file.children && <FileTree files={file.children} onSelectFile={onSelectFile} />}
        </li>
      ))}
    </ul>
  );
}

export default function CodePage() {
  const [selectedFile, setSelectedFile] = useState(placeholderFiles[0]);

  return (
    <div className="flex h-[80vh] border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      {/* Left directory panel */}
      <div className="w-1/4 bg-gray-50 p-4 border-r border-gray-300 overflow-y-auto">
        <h3 className="flex items-center gap-2 font-semibold mb-4">
          <FolderIcon className="w-5 h-5 text-gray-600" />
          Project Files
        </h3>
        <FileTree files={placeholderFiles} onSelectFile={setSelectedFile} />
      </div>

      {/* Right code panel */}
      <div className="w-3/4 p-4 bg-gray-100 flex flex-col">
        <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-1">
          <CodeBracketIcon className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">{selectedFile.name}</span>
        </div>
        <textarea
          value={selectedFile.code}
          onChange={(e) =>
            setSelectedFile((prev) => ({ ...prev, code: e.target.value }))
          }
          className="flex-1 bg-gray-100 border border-gray-300 rounded-lg p-3 font-mono text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );
}
