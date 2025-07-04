import axios from "axios";
import { toast } from "sonner";

export const apiInstance = axios.create({
    baseURL: "http://localhost:5000/api/auth",
    timeout: 2000,
});

export const apiInstanceAuth = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 10000,
});

// Request interceptor to add token
apiInstanceAuth.interceptors.request.use(
    async(config) => {
        const session = JSON.parse(localStorage.getItem("credentials"));

        if (!session) {
            return config;
        }

        config.headers.Authorization = `JWT ${session.token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
apiInstanceAuth.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;

        // Check if error is 401 (Unauthorized) or 403 (Forbidden) - indicating token issues
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            // Show toast notification for session expiry
            toast.error("Session Expired", {
                description: "Your session has expired. Please login again.",
            });

            // Clear the expired credentials
            localStorage.removeItem("credentials");

            // Add a small delay before redirect to allow toast to show
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);