import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../axios";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const isAdmin = useMemo(() => me?.role === "admin", [me]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const jobRes = await api.get(`/api/v1/jobs/${id}`, { signal: controller.signal, withCredentials: true });
        setJob(jobRes.data.job);
      } catch (err) {
        if (err?.code === "ERR_CANCELED") return;
        setError(err?.response?.data?.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    load();
    // do not cancel on route change until effect cleanup to avoid partial unmount issues
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    const loadMe = async () => {
      try {
        const meRes = await api.get("/api/v1/me", { signal: controller.signal, withCredentials: true });
        setMe(meRes?.data?.user || null);
      } catch (_e) {
        setMe(null);
      }
    };
    loadMe();
    return () => controller.abort();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/api/v1/jobs/${id}`, { withCredentials: true });
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        companyName: job.companyName || "",
        location: job.location || "",
        jobType: job.jobType || "",
        description: job.description || "",
      });
    }
  }, [job]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/v1/jobs/${id}`, form, { withCredentials: true });
      setIsEditing(false);
      const res = await api.get(`/api/v1/jobs/${id}`, { withCredentials: true });
      setJob(res.data.job);
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!job) return <div className="p-6">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{job.title}</h1>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-blue-600">Back</Link>
          {isAdmin && !isEditing && (
            <>
              <button className="px-3 py-2 rounded bg-gray-200" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="px-3 py-2 rounded bg-red-600 text-white" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-gray-700">{job.companyName} • {job.location}</div>
          <div className="text-sm text-gray-700 mt-1">{job.jobType}</div>
          <div className="mt-4 whitespace-pre-wrap">{job.description}</div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
          <input className="border rounded px-3 py-2" value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} />
          <input className="border rounded px-3 py-2" value={form.companyName} onChange={(e)=>setForm(f=>({...f,companyName:e.target.value}))} />
          <input className="border rounded px-3 py-2" value={form.location} onChange={(e)=>setForm(f=>({...f,location:e.target.value}))} />
          <select className="border rounded px-3 py-2" value={form.jobType} onChange={(e)=>setForm(f=>({...f,jobType:e.target.value}))}>
            <option value="">Select job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <textarea className="border rounded px-3 py-2" rows={6} value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} />
          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 rounded bg-[#00AAFF] text-white">Save</button>
            <button type="button" onClick={()=>setIsEditing(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JobDetails;


