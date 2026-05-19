import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import SkillGap from "./pages/SkillGap";
import Roadmap from "./pages/Roadmap";
import Recommendations from "./pages/Recommendations";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
        <Route path="/resume" element={<ProtectedLayout><Resume /></ProtectedLayout>} />
        <Route path="/skill-gap" element={<ProtectedLayout><SkillGap /></ProtectedLayout>} />
        <Route path="/roadmap" element={<ProtectedLayout><Roadmap /></ProtectedLayout>} />
        <Route path="/recommendations" element={<ProtectedLayout><Recommendations /></ProtectedLayout>} />
        <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;