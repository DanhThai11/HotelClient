// src/components/auth/AppInitializer.jsx
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { setupInterceptors } from "../utils/ApiFunctions";

const AppInitializer = () => {
  const { handleLogout, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized) {
      setupInterceptors(handleLogout);
    }
  }, [isInitialized, handleLogout]);

  return null; // Không hiển thị gì lên giao diện
};

export default AppInitializer;
