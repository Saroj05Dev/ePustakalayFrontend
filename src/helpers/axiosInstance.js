import axios from "axios";

const axiosInstance = axios.create(); 

axiosInstance.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// ── Public endpoints jahan 401 par redirect NAHI karna ──────────────
// (ye routes bina login ke bhi accessible hain)
const PUBLIC_ENDPOINTS = [
  "/users/login",
  "/users/register",
  "/users/me",  // Auth check - shouldn't redirect on 401
  "/books",
  "/ratings",
  "/categories",
];

const isPublicEndpoint = (url = "") =>
  PUBLIC_ENDPOINTS.some((path) => url.includes(path));

// ── Request: attach token from localStorage ──────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ── Response: handle 401 (token expired / invalid) ───────────────
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error?.config?.url || "";

        // Public endpoints par 401 aaye toh redirect MAT karo
        // (jaise ratings, books — bina login ke bhi dekh sakte hain)
        if (isPublicEndpoint(requestUrl)) {
            return Promise.reject(error);
        }

        if (error?.response?.status === 401) {
            // Kisi protected route par 401 aaye tabhi redirect karo
            localStorage.removeItem("token");
            
            // Sirf tab redirect karein jab hum pehle se login page par na hon
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
