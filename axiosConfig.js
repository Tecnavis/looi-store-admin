import axios from "axios";

const BASE_URL =
  import.meta.env?.VITE_BASE_URL ||
  process.env?.REACT_APP_BASE_URL ||
  "https://looi-store-server-ypdx.onrender.com";

const instance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    Accept: "application/json",
  },
});

// ✅ Attach token automatically for every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ If request is FormData, DO NOT set JSON content-type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default instance;
