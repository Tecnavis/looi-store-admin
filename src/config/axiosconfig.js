import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.looi.in";

const API_BASE = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

const instance = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
  },
});

export default instance;
