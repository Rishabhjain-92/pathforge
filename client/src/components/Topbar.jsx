import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        left: "240px",
        height: "56px",
      }}
      className="fixed top-0 right-0 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-5 z-10"
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        <span className="text-gray-400 text-sm">
          Forge your path, one step at a time.
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition border border-gray-700">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-xs font-medium leading-none">
              {user?.name}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">Student</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;