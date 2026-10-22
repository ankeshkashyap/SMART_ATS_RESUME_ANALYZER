import axios from "axios";

// API base URL comes from Vite env vars:
//   - VITE_API_BASE_URL (production, set in Vercel dashboard)
//   - frontend/.env.development (local, defaults to http://localhost:8000)
// Falls back to localhost for local dev when the env var is absent.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;