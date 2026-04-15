/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { loginUser as loginApi, registerUser as registerApi } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const persistAuth = (authToken, authUser) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    persistAuth(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    return registerApi(payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    login,
    logout,
    register,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
