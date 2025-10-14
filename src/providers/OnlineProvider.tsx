"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "@/redux/features/socket/socketHooks";
import { currentUser } from "@/redux/features/auth/authSlice";

export default function OnlineProvider({ children }: { children: React.ReactNode }) {
    const user = useSelector(currentUser);
    const { connectSocket, disconnectSocket } = useSocket();

    useEffect(() => {
        if (user?._id) {
            console.log("🔗 Connecting socket for:", user._id);
            connectSocket(user._id);
        }

        return () => {
            console.log("🔌 Disconnecting socket");
            disconnectSocket();
        };
    }, [user?._id, connectSocket, disconnectSocket]);

    return <>{children}</>;
}
