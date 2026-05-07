import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { BACKEND_URL } from "../config";
import {
    socketWorkspaceCreated,
    socketWorkspaceDeleted,
    socketMemberAdded,
    socketMemberRemoved,
} from "../redux/slices/workspaceSlice";

// Single socket instance for the whole app — created once at module level
let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(BACKEND_URL, {
            withCredentials: true,
            transports: ["websocket"],
        });
    }
    return socket;
}

export function useSocket(userId: string | undefined) {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!userId) return;

        const s = getSocket();

        // Join personal room so backend can emit workspace:new to just you
        s.emit("joinUser", userId);

        // ✅ THE MISSING LISTENER — fires when backend does io.to(userId).emit("workspace:new", ...)
        s.on("workspace:new", (workspace) => {
            dispatch(socketWorkspaceCreated(workspace));
        });

        s.on("workspace:deleted", (workspaceId: string) => {
            dispatch(socketWorkspaceDeleted(workspaceId));
        });

        s.on("member:added", (member) => {
            dispatch(socketMemberAdded(member));
        });

        s.on("member:removed", (memberId: string) => {
            dispatch(socketMemberRemoved(memberId));
        });

        s.on("connect", () => {
            // Re-join personal room on reconnect (e.g. after network drop)
            s.emit("joinUser", userId);
        });

        return () => {
            s.off("workspace:new");
            s.off("workspace:deleted");
            s.off("member:added");
            s.off("member:removed");
            s.off("connect");
        };
    }, [userId, dispatch]);
}