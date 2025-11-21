import React,{ createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");
    return token ? { role, name, token } : null;
  });

  const login = (data) => {
    const normalizedRole = data.role ? String(data.role).toLowerCase() : "";
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", normalizedRole);
    localStorage.setItem("name", data.name);
    setUser({ ...data, role: normalizedRole });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // auth state in sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "token" || e.key === "role" || e.key === "name") {
        const token = localStorage.getItem("token");
        if (token) {
          setUser({
            token,
            role: localStorage.getItem("role")?.toLowerCase() || "",
            name: localStorage.getItem("name") || "",
          });
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
