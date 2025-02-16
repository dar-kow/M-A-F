import axios from "axios";

// Create an axios instance for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:20267/api",
});

export default api;
