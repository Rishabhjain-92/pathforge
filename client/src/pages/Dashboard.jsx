import { useAuth } from "../context/AuthContext";

const Dashboard = () => {

  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">
        Welcome back,{" "}
        <span className="text-orange-500">
          {user?.name}
        </span>{" "}
        👋
      </h1>

      <p className="text-gray-400 mt-1">
        Here's your career progress overview
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Readiness Score
          </p>

          <p className="text-3xl font-bold text-orange-500 mt-2">
            0%
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Target Role
          </p>

          <p className="text-xl font-semibold mt-2">
            Not set
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Target Company
          </p>

          <p className="text-xl font-semibold mt-2">
            Not set
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Days on PathForge
          </p>

          <p className="text-3xl font-bold mt-2">
            1
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
