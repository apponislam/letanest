import { io, Socket } from "socket.io-client";
import store from "@/redux/store";
import { messageApi } from "../messages/messageApi";
import { setSocketConnected, addOnlineUser, removeOnlineUser, setTypingUser, clearTypingUsers } from "./socketSlice";

class SocketService {
    private socket: Socket | null = null;

    connect(userId: string) {
        this.socket = io("http://localhost:5000", {
            withCredentials: true,
        });

        this.socket.emit("user:join", userId);

        this.socket.on("connect", () => {
            store.dispatch(setSocketConnected(true));
            console.log("Connected to server");
        });

        this.socket.on("disconnect", () => {
            store.dispatch(setSocketConnected(false));
            console.log("Disconnected from server");
        });

        this.socket.on("user:online", (userId: string) => {
            store.dispatch(addOnlineUser(userId));
        });

        this.socket.on("user:offline", (userId: string) => {
            store.dispatch(removeOnlineUser(userId));
        });

        this.socket.on("message:new", (message) => {
            // Update RTK Query cache with new message
            store.dispatch(
                messageApi.util.updateQueryData("getConversationMessages", { conversationId: message.conversationId }, (draft) => {
                    draft.unshift(message);
                })
            );

            // Also update conversations list
            store.dispatch(
                messageApi.util.updateQueryData("getUserConversations", undefined, (draft) => {
                    const conversationIndex = draft.findIndex((conv: any) => conv._id === message.conversationId);
                    if (conversationIndex !== -1) {
                        draft[conversationIndex].lastMessage = message;
                        draft[conversationIndex].updatedAt = new Date().toISOString();
                        // Move to top
                        const [updatedConv] = draft.splice(conversationIndex, 1);
                        draft.unshift(updatedConv);
                    }
                })
            );
        });

        this.socket.on("message:read", (data) => {
            // Update message read status in cache
            store.dispatch(
                messageApi.util.updateQueryData("getConversationMessages", { conversationId: data.conversationId }, (draft) => {
                    const message = draft.find((msg: any) => msg._id === data.messageId);
                    if (message && !message.readBy.includes(data.readBy)) {
                        message.readBy.push(data.readBy);
                    }
                })
            );
        });

        this.socket.on("message:typing", (data) => {
            store.dispatch(setTypingUser(data));
        });

        this.socket.on("conversation:new", (conversation) => {
            // Add new conversation to cache
            store.dispatch(
                messageApi.util.updateQueryData("getUserConversations", undefined, (draft) => {
                    draft.unshift(conversation);
                })
            );
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            store.dispatch(setSocketConnected(false));
        }
    }

    joinConversation(conversationId: string) {
        if (this.socket) {
            this.socket.emit("conversation:join", conversationId);
        }
    }

    leaveConversation(conversationId: string) {
        if (this.socket) {
            this.socket.emit("conversation:leave", conversationId);
            store.dispatch(clearTypingUsers(conversationId));
        }
    }

    sendTyping(conversationId: string, userId: string, isTyping: boolean) {
        if (this.socket) {
            this.socket.emit("message:typing", {
                conversationId,
                userId,
                isTyping,
            });
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService();
