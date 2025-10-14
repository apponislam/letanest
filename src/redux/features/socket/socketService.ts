import { io, Socket } from "socket.io-client";
import store from "@/redux/store";
import { messageApi } from "../messages/messageApi";
import { setSocketConnected, addOnlineUser, removeOnlineUser, setTypingUser, clearTypingUsers, setOnlineUsers } from "./socketSlice";

class SocketService {
    private socket: Socket | null = null;
    private isInitialized = false;

    connect(userId: string) {
        // Prevent multiple connections
        if (this.socket?.connected) {
            console.log("🔄 Socket already connected");
            return;
        }

        this.socket = io(`${process.env.NEXT_PUBLIC_BASE_API}`, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });

        this.socket.emit("user:join", userId);

        this.socket.on("connect", () => {
            console.log("✅ Socket connected successfully");
            store.dispatch(setSocketConnected(true));
        });

        this.socket.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
            store.dispatch(setSocketConnected(false));
        });

        this.socket.on("connect_error", (error) => {
            console.error("🔥 Socket connection error:", error);
        });

        // Receive initial list of online users
        this.socket.on("users:online", (userIds: string[]) => {
            console.log("👥 Online users received:", userIds);
            store.dispatch(setOnlineUsers(userIds));
        });

        this.socket.on("user:online", (userId: string) => {
            console.log("👤 User came online:", userId);
            store.dispatch(addOnlineUser(userId));
        });

        this.socket.on("user:offline", (userId: string) => {
            console.log("👤 User went offline:", userId);
            store.dispatch(removeOnlineUser(userId));
        });

        this.socket.on("message:new", (message) => {
            console.log("📨 New message received via socket:", message);
            this.handleNewMessage(message);
        });

        this.socket.on("message:read", (data) => {
            console.log("📖 Message read receipt:", data);
            this.updateMessageReadStatus(data);
        });

        this.socket.on("message:typing", (data) => {
            console.log("⌨️ Typing indicator:", data);
            store.dispatch(
                setTypingUser({
                    conversationId: data.conversationId,
                    userId: data.userId,
                    isTyping: data.isTyping,
                })
            );
        });

        this.socket.on("conversation:new", (conversation) => {
            console.log("💬 New conversation:", conversation);
            this.addNewConversation(conversation);
        });

        this.socket.on("offer:rejected", (data) => {
            console.log("📌 Offer rejected via socket:", data);

            // 1️⃣ Update conversation messages
            store.dispatch(
                messageApi.util.updateQueryData("getConversationMessages", { conversationId: data.conversationId }, (draft: any) => {
                    if (!draft?.data || !Array.isArray(draft.data)) return;

                    // Replace the whole array to trigger React re-render
                    draft.data = draft.data.map((m: any) => (m._id === data.messageId ? { ...m, type: "rejected" } : m));
                })
            );

            // 2️⃣ Update lastMessage in conversation list
            store.dispatch(
                messageApi.util.updateQueryData("getUserConversations", undefined, (draft: any) => {
                    if (!draft?.data || !Array.isArray(draft.data)) return;

                    draft.data = draft.data.map((conv: any) => {
                        if (conv._id === data.conversationId && conv.lastMessage?._id === data.messageId) {
                            return { ...conv, lastMessage: { ...conv.lastMessage, type: "rejected" } };
                        }
                        return conv;
                    });
                })
            );
        });

        this.isInitialized = true;
    }

    // private handleNewMessage(message: any) {
    //     console.log("🔄 [handleNewMessage] Processing new message:", message._id);

    //     // SIMPLE FIX: Always invalidate the cache to force refetch
    //     console.log("🔄 Invalidating cache to force refetch...");
    //     store.dispatch(messageApi.util.invalidateTags([{ type: "Messages", id: message.conversationId }, "Messages", "Conversations"]));

    //     console.log("✅ Cache invalidated - RTK Query will automatically refetch");
    // }

    private handleNewMessage(message: any) {
        console.log("🔄 [handleNewMessage] Processing new message:", message._id);

        // SIMPLE FIX: Invalidate everything to force complete refetch
        console.log("🔄 Invalidating ALL cache to force refetch...");

        // Invalidate both messages and conversations
        store.dispatch(
            messageApi.util.invalidateTags([
                { type: "Messages", id: message.conversationId }, // Specific conversation messages
                "Messages", // All messages
                "Conversations", // All conversations
            ])
        );

        console.log("✅ Cache invalidated - RTK Query will automatically refetch everything");
    }

    private updateMessageReadStatus(data: any) {
        try {
            const currentUser = store.getState().auth.user;

            // Update the specific message
            store.dispatch(
                messageApi.util.updateQueryData("getConversationMessages", { conversationId: data.conversationId }, (draft: any) => {
                    const messages = draft?.data || draft;
                    if (!Array.isArray(messages)) return;

                    const message = messages.find((msg: any) => msg._id === data.messageId);
                    if (message) {
                        if (!message.readBy) message.readBy = [];
                        if (!message.readBy.includes(data.readBy)) {
                            message.readBy.push(data.readBy);
                        }
                    }
                })
            );

            // Update conversation unread count if current user read the message
            if (data.readBy === currentUser?._id) {
                store.dispatch(
                    messageApi.util.updateQueryData("getUserConversations", undefined, (draft: any) => {
                        if (!draft || !draft.data || !Array.isArray(draft.data)) return;

                        const conversations = draft.data;
                        const convIndex = conversations.findIndex((conv: any) => conv._id === data.conversationId);

                        if (convIndex !== -1 && conversations[convIndex].unreadCount > 0) {
                            conversations[convIndex].unreadCount = Math.max(0, conversations[convIndex].unreadCount - 1);
                        }
                    })
                );
            }
        } catch (error) {
            console.log("Error updating read status:", error);
        }
    }

    private addNewConversation(conversation: any) {
        try {
            store.dispatch(
                messageApi.util.updateQueryData("getUserConversations", undefined, (draft: any) => {
                    if (!draft) return;

                    const conversations = draft.data || draft;
                    if (!Array.isArray(conversations)) return;

                    const exists = conversations.some((conv: any) => conv._id === conversation._id);

                    if (!exists) {
                        conversations.unshift(conversation);
                    }
                })
            );
        } catch (error) {
            console.log("Error adding conversation:", error);
            store.dispatch(messageApi.util.invalidateTags(["Conversations"]));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isInitialized = false;
            store.dispatch(setSocketConnected(false));
            console.log("🔌 Socket disconnected");
        }
    }

    joinConversation(conversationId: string) {
        if (this.socket?.connected) {
            this.socket.emit("conversation:join", conversationId);
            console.log("🚀 Joined conversation:", conversationId);
        } else {
            console.warn("⚠️ Socket not connected, cannot join conversation");
        }
    }

    leaveConversation(conversationId: string) {
        if (this.socket?.connected) {
            this.socket.emit("conversation:leave", conversationId);
            store.dispatch(clearTypingUsers(conversationId));
            console.log("🚪 Left conversation:", conversationId);
        }
    }

    sendTyping(conversationId: string, userId: string, isTyping: boolean) {
        if (this.socket?.connected) {
            this.socket.emit("message:typing", {
                conversationId,
                userId,
                isTyping,
            });
        } else {
            console.warn("⚠️ Socket not connected, cannot send typing indicator");
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService();
