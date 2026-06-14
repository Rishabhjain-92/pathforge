import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./index.css";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    // Dynamically point to port 5000 on the same host (AWS server IP or domain)
    return `${protocol}//${hostname}:5000`;
  }
  return "http://localhost:5000";
};

axios.defaults.baseURL = getBaseURL();


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);