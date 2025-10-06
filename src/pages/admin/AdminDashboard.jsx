import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../axios";
import JobForm from "../JobForm";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  const loadJobs = async (signal) => {
    try {
      const res = await api.get("/api/v1/jobs", { withCredentials: true, signal });
      setJobs(res.data.jobs || []);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        navigate("/admin/login");
        return;
      }
      setError(err?.response?.data?.message || "Failed to load jobs");
    }
  };

  const loadUser = async () => {
    try {
      const res = await api.get("/api/v1/me", { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      console.log("Failed to load user info:", err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadJobs(controller.signal);
    loadUser();
    return () => controller.abort();
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          {user && (
            <p className="text-sm text-gray-600">Welcome, {user.email}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="bg-green-600 text-white rounded px-3 py-2"
            onClick={() => setShowForm((s) => !s)}
          >{showForm ? "Close Job Form" : "Post a Job"}</button>
          <Link to="/" className="text-blue-600">Back to site</Link>
          <button
            className="bg-gray-200 rounded px-3 py-2"
            onClick={async () => { 
              await api.post("/api/v1/logout", {}, { withCredentials: true }); 
              navigate("/admin/login"); 
            }}
          >Logout</button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8">
          <JobForm
            onPublish={async () => {
              setShowForm(false);
              await loadJobs();
            }}
            onSaveDraft={() => {}}
          />
        </div>
      )}

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(j => (
          <div key={j._id} className="border rounded-lg p-3 bg-white shadow">
            <div className="font-semibold">{j.title}</div>
            <div className="text-sm text-gray-600">
              {j.companyName} • {
                j.locations && j.locations.length > 0 
                  ? j.locations.length > 2 
                    ? `${j.locations.slice(0, 2).join(", ")} +${j.locations.length - 2} more`
                    : j.locations.join(", ")
                  : j.location
              }
            </div>
            <div className="text-sm mt-1">{j.jobType}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;



