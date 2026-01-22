import { createContext, useContext, useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  /* =========================
     INITIAL AUTH CHECK
     ========================= */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    setAuthChecked(true);
  }, []);

  /* =========================
     LOGIN
     ========================= */
  const login = async (employee_code, password) => {
    try {
      const res = await axiosSecure.post("/api/auth/login", {
        employee_code,
        password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Invalid credentials"
      );
    }
  };

  /* =========================
     LOGOUT
     ========================= */
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authChecked,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
