import { baseApi } from "../../api/baseApi";

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create conversation
        createConversation: builder.mutation({
            query: (conversationData) => ({
                url: "/messages/conversations",
                method: "POST",
                body: conversationData,
            }),
            invalidatesTags: ["Conversations"],
        }),

        // Get user conversations
        getUserConversations: builder.query({
            query: () => "/messages/conversations/my-conversations",
            providesTags: ["Conversations"],
        }),

        // Get conversation by ID
        getConversationById: builder.query({
            query: (conversationId) => `/messages/conversations/${conversationId}`,
            providesTags: (_result, _error, arg) => [{ type: "Conversations", id: arg }],
        }),

        // Send message
        sendMessage: builder.mutation({
            query: (messageData) => ({
                url: "/messages/messages",
                method: "POST",
                body: messageData,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Conversations", id: arg.conversationId }, "Messages"],
        }),

        // Get conversation messages
        getConversationMessages: builder.query({
            query: ({ conversationId, page = 1, limit = 50 }) => `/messages/messages/conversation/${conversationId}?page=${page}&limit=${limit}`,
            providesTags: ["Messages"],
            keepUnusedDataFor: 300,
        }),

        // Get message by ID
        getMessageById: builder.query({
            query: (messageId) => `/messages/messages/${messageId}`,
            providesTags: (_result, _error, arg) => [{ type: "Messages", id: arg }],
        }),

        // Mark message as read
        markAsRead: builder.mutation({
            query: (messageId) => ({
                url: `/messages/messages/${messageId}/read`,
                method: "PATCH",
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Messages", id: arg }],
        }),
    }),
});

export const { useCreateConversationMutation, useGetUserConversationsQuery, useGetConversationByIdQuery, useSendMessageMutation, useGetConversationMessagesQuery, useGetMessageByIdQuery, useMarkAsReadMutation } = messageApi;
