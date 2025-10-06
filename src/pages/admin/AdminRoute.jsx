import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../../axios";

const AdminRoute = ({ children }) => {
  const [status, setStatus] = useState("loading"); // loading | authed | denied

  useEffect(() => {
    const controller = new AbortController();
    const check = async () => {
      try {
        const res = await api.get("/api/v1/me", { withCredentials: true, signal: controller.signal });
        console.log("Auth check response:", res.data);
        if (res?.data?.user?.role === "admin") {
          setStatus("authed");
        } else {
          console.log("User is not admin, role:", res?.data?.user?.role);
          setStatus("denied");
        }
      } catch (err) {
        console.log("Auth check failed:", err.response?.data || err.message);
        setStatus("denied");
      }
    };
    check();
    return () => controller.abort();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Checking admin access...</p>
        </div>
      </div>
    );
  }
  
  if (status === "denied") {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminRoute;



