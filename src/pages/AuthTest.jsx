import React, { useState, useEffect } from "react";
import api from "../../axios.js";

const AuthTest = () => {
  const [authStatus, setAuthStatus] = useState("checking");
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  const checkAuth = async () => {
    try {
      setAuthStatus("checking");
      const response = await api.get("/api/v1/me", { withCredentials: true });
      setUserInfo(response.data.user);
      setAuthStatus("authenticated");
      setError("");
    } catch (err) {
      setAuthStatus("not_authenticated");
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  const testJobCreation = async () => {
    try {
      const testJob = {
        title: "Test Job",
        companyName: "Test Company",
        location: "remote",
        jobType: "Full-time",
        salaryRange: {
          min: 50000,
          max: 100000,
          currency: "INR",
          period: "per_month"
        },
        description: "This is a test job",
        requirements: [],
        responsibilities: [],
        isPublished: true
      };

      const response = await api.post("/api/v1/createJob", testJob, { withCredentials: true });
      alert("Test job created successfully!");
    } catch (err) {
      alert(`Job creation failed: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Authentication Status:</h2>
        <div className={`p-3 rounded ${authStatus === 'authenticated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {authStatus === 'checking' && 'Checking...'}
          {authStatus === 'authenticated' && '✅ Authenticated'}
          {authStatus === 'not_authenticated' && '❌ Not Authenticated'}
        </div>
      </div>

      {userInfo && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">User Information:</h2>
          <div className="bg-gray-100 p-3 rounded">
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Role:</strong> {userInfo.role}</p>
            <p><strong>ID:</strong> {userInfo.id}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Error:</h2>
          <div className="bg-red-100 p-3 rounded text-red-800">
            {error}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button 
          onClick={checkAuth}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check Auth Again
        </button>
        
        {authStatus === 'authenticated' && (
          <button 
            onClick={testJobCreation}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Job Creation
          </button>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Debug Information:</h2>
        <div className="bg-gray-100 p-3 rounded text-sm">
          <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || "https://job-backend-1-9k6b.onrender.com"}</p>
          <p><strong>With Credentials:</strong> true</p>
          <p><strong>Current URL:</strong> {window.location.href}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
