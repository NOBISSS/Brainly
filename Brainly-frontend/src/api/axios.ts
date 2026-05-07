import axios from "axios";
import { BACKEND_URL } from "../config";

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const isAuthRoute =
//       error.config?.url?.includes("/signin") ||
//       error.config?.url?.includes("/signup") ||
//       error.config?.url?.includes("/sendotp") ||
//       error.config?.url?.includes("/resetpassword");

//     if (error?.response?.status === 401 && !isAuthRoute) {
//       window.location.href = "/signin";
//     }

//     return Promise.reject(error);
//   }
// );
