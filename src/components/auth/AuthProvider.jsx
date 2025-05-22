// src/components/auth/AuthProvider.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { refreshToken } from "../utils/ApiFunctions"; // Import hàm refreshToken
import jwt_decode from "jwt-decode";

export const AuthContext = createContext({
  user: null,
  handleLogin: (token) => {},
  handleLogout: () => {},
  handleRefreshToken: () => {},
  isInitialized: false, // Đảm bảo mặc định là false
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Đã thêm dòng này
  const [isInitialized, setIsInitialized] = useState(false); // Khởi tạo biến isInitialized

  // Đọc token từ localStorage và thiết lập trạng thái khi component load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwt_decode(token);
      setUser(decodedUser);
      setIsAuthenticated(true);
    }
    setIsInitialized(true); // Đánh dấu là đã khởi tạo xong
  }, []);

  const handleLogin = (token) => {
    const decodedUser = jwt_decode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", decodedUser.sub);
    localStorage.setItem("userRole", decodedUser.roles);
    setUser(decodedUser);
    setIsAuthenticated(true); // Đảm bảo không bị mất trạng thái
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false); // Đảm bảo là đã logout
  };

  const handleRefreshToken = async () => {
    try {
      const newAccessToken = await refreshToken(); // Gọi refreshToken
      handleLogin(newAccessToken); // Cập nhật lại context với token mới
    } catch (error) {
      console.error("Error refreshing token", error);
      handleLogout(); // Đăng xuất nếu refresh thất bại
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isInitialized, // Expose isInitialized cho AppInitializer.jsx
        handleLogin,
        handleLogout,
        handleRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Tạo một hook custom useAuth để dễ dàng sử dụng context trong các component
export const useAuth = () => useContext(AuthContext);
