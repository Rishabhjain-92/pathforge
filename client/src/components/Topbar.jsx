import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-56 right-0 h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 lg:px-8 z-10">

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 flex-1 max-w-sm">
        <span className="text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-gray-300 outline-none w-full placeholder-gray-500"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="text-gray-400 hover:text-white transition">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.email}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Topbar;