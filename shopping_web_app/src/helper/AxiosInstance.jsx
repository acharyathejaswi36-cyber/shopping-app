import axios from "axios";
import { LOGIN, REGISTER, RESET_PASSWORD, SEND_OTP, VERIFY_OTP } from "../endpoints/EndPoints";

export const AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

const publicRoutes = [
    REGISTER,
    LOGIN,
    SEND_OTP,
    VERIFY_OTP,
    RESET_PASSWORD,
  ,
];

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isPublic = publicRoutes.some((route) =>
    config.url.includes(route)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});