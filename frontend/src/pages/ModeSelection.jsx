import { UserIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function ModeSelection() {
  const navigate = useNavigate();

  const handleSelect = (mode) => {
    localStorage.setItem("executionMode", mode); // simple persistence
    navigate("/Agentic"); // navigate to Agentic page
  };

  return (
    <div className="flex gap-6 justify-center mt-20">
      <div
        className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
        onClick={() => handleSelect("human")}
      >
        <UserIcon className="w-10 h-10 text-blue-600" />
        <span className="mt-2 font-medium text-lg">Human in the Loop</span>
      </div>
      <div
        className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
        onClick={() => handleSelect("autonomous")}
      >
        <RocketLaunchIcon className="w-10 h-10 text-green-600" />
        <span className="mt-2 font-medium text-lg">Autonomous</span>
      </div>
    </div>
  );
}
