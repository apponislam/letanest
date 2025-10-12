import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { socketService } from "./socketService";
import { RootState } from "@/redux/store";

export const useSocket = () => {
    const dispatch = useDispatch();
    const { isConnected, onlineUsers, typingUsers } = useSelector((state: RootState) => state.socket);

    const connectSocket = useCallback((userId: string) => {
        socketService.connect(userId);
    }, []);

    const disconnectSocket = useCallback(() => {
        socketService.disconnect();
    }, []);

    const joinConversation = useCallback((conversationId: string) => {
        socketService.joinConversation(conversationId);
    }, []);

    const leaveConversation = useCallback((conversationId: string) => {
        socketService.leaveConversation(conversationId);
    }, []);

    const sendTyping = useCallback((conversationId: string, userId: string, isTyping: boolean) => {
        socketService.sendTyping(conversationId, userId, isTyping);
    }, []);

    const getTypingUsers = useCallback(
        (conversationId: string) => {
            return typingUsers[conversationId] || [];
        },
        [typingUsers]
    );

    const isUserOnline = useCallback(
        (userId: string) => {
            return onlineUsers.includes(userId);
        },
        [onlineUsers]
    );

    return {
        isConnected,
        onlineUsers,
        connectSocket,
        disconnectSocket,
        joinConversation,
        leaveConversation,
        sendTyping,
        getTypingUsers,
        isUserOnline,
    };
};
