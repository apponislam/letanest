import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
    isConnected: boolean;
    onlineUsers: string[];
    typingUsers: { [conversationId: string]: string[] };
}

const initialState: SocketState = {
    isConnected: false,
    onlineUsers: [],
    typingUsers: {},
};

export const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocketConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        setOnlineUsers: (state, action: PayloadAction<string[]>) => {
            state.onlineUsers = action.payload;
        },
        addOnlineUser: (state, action: PayloadAction<string>) => {
            if (!state.onlineUsers.includes(action.payload)) {
                state.onlineUsers.push(action.payload);
            }
        },
        removeOnlineUser: (state, action: PayloadAction<string>) => {
            state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
        },
        setTypingUser: (state, action: PayloadAction<{ conversationId: string; userId: string; isTyping: boolean }>) => {
            const { conversationId, userId, isTyping } = action.payload;

            if (!state.typingUsers[conversationId]) {
                state.typingUsers[conversationId] = [];
            }

            if (isTyping && !state.typingUsers[conversationId].includes(userId)) {
                state.typingUsers[conversationId].push(userId);
            } else if (!isTyping) {
                state.typingUsers[conversationId] = state.typingUsers[conversationId].filter((id) => id !== userId);
            }
        },
        clearTypingUsers: (state, action: PayloadAction<string>) => {
            state.typingUsers[action.payload] = [];
        },
    },
});

export const { setSocketConnected, setOnlineUsers, addOnlineUser, removeOnlineUser, setTypingUser, clearTypingUsers } = socketSlice.actions;

export default socketSlice.reducer;
