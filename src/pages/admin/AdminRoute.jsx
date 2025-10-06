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
        if (res?.data?.user?.role === "admin") setStatus("authed");
        else setStatus("denied");
      } catch (_e) {
        setStatus("denied");
      }
    };
    check();
    return () => controller.abort();
  }, []);

  if (status === "loading") return <div className="p-6">Checking access…</div>;
  if (status === "denied") return <Navigate to="/admin/login" replace />;
  return children;
};

export default AdminRoute;



