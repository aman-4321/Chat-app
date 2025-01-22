import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:8081/api/v1",
  withCredentials: true,
});
