import axios from "axios";
const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL|| "https://job-backend-1-9k6b.onrender.com",
  withCredentials: true, // important if using httpOnly cookies
});

export default api
