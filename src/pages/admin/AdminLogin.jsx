import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/v1/login", { email, password }, { withCredentials: true });
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="bg-purple-600 text-white rounded px-3 py-2">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-sm mt-3">No account? <Link to="/admin/signup" className="text-blue-600">Create one</Link></p>
    </div>
  );
};

export default AdminLogin;



