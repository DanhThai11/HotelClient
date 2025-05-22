// src/components/auth/AppInitializer.jsx
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { setupInterceptors } from "../utils/ApiFunctions";
import { api } from "../utils/ApiFunctions";

const AppInitializer = () => {
  const { handleLogin, handleLogout, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized) {
      setupInterceptors(api, handleLogin, handleLogout);
    }
  }, [isInitialized, handleLogin, handleLogout]);

  return null; // Không hiển thị gì lên giao diện
};

export default AppInitializer;
