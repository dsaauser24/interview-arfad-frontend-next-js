import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // Mendapatkan sesi dari NextAuth
    if (session?.user.token) {
      config.headers.Authorization = `Bearer ${session.user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
