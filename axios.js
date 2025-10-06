import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://job-backend-1-9k6b.onrender.com",
  withCredentials: true, // important if using httpOnly cookies
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    console.log("With credentials:", config.withCredentials);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.response?.data, error.config?.url);
    return Promise.reject(error);
  }
);

export default api;
