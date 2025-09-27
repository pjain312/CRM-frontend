import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "../utils/auth";
import { toast } from "sonner";

const api = axios.create({ baseURL: "http://localhost:9005" });

// Attach token to every request
api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired tokens
api.interceptors.response.use(null, async error => {
  if (error.response?.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const response = await axios.post("http://localhost:9005/auth/refresh", { refreshToken });
        const data = response.data.data;
        saveTokens(data.accessToken, refreshToken);
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(error.config);
      } catch {
        await axios.post("http://localhost:9005/auth/logout", { refreshToken });
        clearTokens();
        window.location.href = "/login"; 
        toast.error("Session expired please Login again");
      }
    }
  }
  return Promise.reject(error);
});

export default api;
