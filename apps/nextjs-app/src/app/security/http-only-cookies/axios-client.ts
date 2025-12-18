import axios from "axios";

export const secureApi = axios.create({
  baseURL: "/api", // Or your backend URL if separate
  withCredentials: true, // Crucial: sends cookies automatically
});
