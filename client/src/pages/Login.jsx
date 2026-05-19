import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">

        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to <span className="text-orange-500">PathForge</span>
        </h1>
        <p className="text-gray-400 mb-6">Login to forge your path</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;