import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./index.css";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);