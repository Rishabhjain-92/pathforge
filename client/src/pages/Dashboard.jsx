import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-orange-500">{user?.name}</span>
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-sm">Readiness Score</p>
            <p className="text-4xl font-bold text-orange-500 mt-2">0%</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-sm">Target Role</p>
            <p className="text-xl font-semibold mt-2">Not set</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-sm">Target Company</p>
            <p className="text-xl font-semibold mt-2">Not set</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;