import React from "react";
import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axiosConfig";

const ProtectedRoute = ({ children, role }) => {
  const { user, logout } = useContext(AuthContext);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      if (!user) {
        if (mounted) {
          setAllowed(false);
          setChecking(false);
        }
        return;
      }

      try {
        const res = await API.get("/auth/me");
        const serverRole = res.data?.role;
        if (role) {
          if (String(serverRole || "").toLowerCase() === String(role || "").toLowerCase()) {
            if (mounted) setAllowed(true);
          } else {
            if (mounted) setAllowed(false);
          }
        } else {
          if (mounted) setAllowed(true);
        }
      } catch (err) {
        // Token invalid or request failed: clear local auth
        console.error("Auth verify failed:", err);
        logout();
        if (mounted) setAllowed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    };

    verify();
    return () => { mounted = false; };
  }, [user, role, logout]);

  if (checking) return null;

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (!allowed) {
    console.log(`User role (${user.role}) doesn't match required role (${role}), redirecting to home`);
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
