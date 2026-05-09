// src/socket/socket.ts
import { io } from "socket.io-client";

const SOCKET_URL = location.hostname=="localhost"
? "http://localhost:3000"
: "https://13-62-231-216.nip.io";  // ✅ direct to VPS through Nginx, bypasses Vercel

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});