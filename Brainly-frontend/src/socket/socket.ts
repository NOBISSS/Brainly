import { BACKEND_URL } from "@/config";
import { io } from "socket.io-client";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
});
