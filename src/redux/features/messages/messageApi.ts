import { baseApi } from "../../api/baseApi";

export const messageApi = baseApi.injectEndpoints({
    overrideExisting: true,
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
            transformResponse: (response: any) => response,
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
            onQueryStarted: async (messageData, { dispatch, queryFulfilled }) => {
                const tempId = `optimistic-${Date.now()}`;
                const patchResult = dispatch(
                    messageApi.util.updateQueryData("getConversationMessages", { conversationId: messageData.conversationId }, (draft: any) => {
                        // Handle both response formats (data array or direct array)
                        const messagesArray = draft?.data || draft || [];

                        const optimisticMessage = {
                            _id: tempId,
                            ...messageData,
                            sender: {
                                _id: messageData.sender,
                                name: "You", // Will be updated when real message comes
                                profileImg: "",
                            },
                            createdAt: new Date().toISOString(),
                            isOptimistic: true,
                        };

                        if (Array.isArray(messagesArray)) {
                            messagesArray.push(optimisticMessage);
                        } else if (draft?.data) {
                            draft.data.push(optimisticMessage);
                        }
                    })
                );

                try {
                    await queryFulfilled;
                    // The real message will come via socket and replace the optimistic one
                } catch (error) {
                    patchResult.undo();
                }
            },
        }),
        // Send message
        sendMessageAuto: builder.mutation({
            query: (messageData) => ({
                url: "/messages/messages/auto",
                method: "POST",
                body: messageData,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Conversations", id: arg.conversationId }, "Messages"],
            onQueryStarted: async (messageData, { dispatch, queryFulfilled }) => {
                const tempId = `optimistic-${Date.now()}`;
                const patchResult = dispatch(
                    messageApi.util.updateQueryData("getConversationMessages", { conversationId: messageData.conversationId }, (draft: any) => {
                        // Handle both response formats (data array or direct array)
                        const messagesArray = draft?.data || draft || [];

                        const optimisticMessage = {
                            _id: tempId,
                            ...messageData,
                            sender: {
                                _id: messageData.sender,
                                name: "You", // Will be updated when real message comes
                                profileImg: "",
                            },
                            createdAt: new Date().toISOString(),
                            isOptimistic: true,
                        };

                        if (Array.isArray(messagesArray)) {
                            messagesArray.push(optimisticMessage);
                        } else if (draft?.data) {
                            draft.data.push(optimisticMessage);
                        }
                    })
                );

                try {
                    await queryFulfilled;
                    // The real message will come via socket and replace the optimistic one
                } catch (error) {
                    patchResult.undo();
                }
            },
        }),

        // Get conversation messages
        getConversationMessages: builder.query({
            query: ({ conversationId, page = 1, limit = 50 }) => `/messages/messages/conversation/${conversationId}?page=${page}&limit=${limit}`,
            providesTags: (result, error, arg) => [{ type: "Messages", id: arg.conversationId }, "Messages"],
            transformResponse: (response: any) => {
                // Ensure consistent response format
                return Array.isArray(response) ? { data: response } : response;
            },
            keepUnusedDataFor: 60,
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
        rejectOffer: builder.mutation({
            query: ({ messageId, conversationId }) => ({
                url: `/messages/${messageId}/reject`,
                method: "PATCH",
                body: { conversationId },
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Messages", id: arg.conversationId }, "Messages", "Conversations"],
            onQueryStarted: async ({ messageId, conversationId }, { dispatch, queryFulfilled }) => {
                // Optimistically mark message as rejected locally for sender
                const patch = dispatch(
                    messageApi.util.updateQueryData("getConversationMessages", { conversationId }, (draft: any) => {
                        const messages = draft?.data || draft || [];
                        const msg = messages.find((m: any) => m._id === messageId);
                        if (msg) msg.type = "rejected";
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        }),
        convertRequestToOffer: builder.mutation({
            query: ({ messageId, conversationId }) => ({
                url: `/messages/${messageId}/convert-to-offer`,
                method: "PATCH",
                body: { conversationId },
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Messages", id: arg.conversationId }, "Messages", "Conversations"],
            onQueryStarted: async ({ messageId, conversationId }, { dispatch, queryFulfilled }) => {
                // Optimistically mark message as offer locally for sender
                const patch = dispatch(
                    messageApi.util.updateQueryData("getConversationMessages", { conversationId }, (draft: any) => {
                        const messages = draft?.data || draft || [];
                        const msg = messages.find((m: any) => m._id === messageId);
                        if (msg) msg.type = "offer";
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        }),
        // NEW: Mark conversation as read
        markConversationAsReads: builder.mutation({
            query: (conversationId) => ({
                url: `/messages/conversations/${conversationId}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Conversations"],
        }),
        getTotalUnreadCount: builder.query<any, void>({
            query: () => "/messages/unread-count",
            providesTags: ["Conversations", "Messages"],
        }),
    }),
});

// useMarkConversationAsReadMutation;

export const {
    useCreateConversationMutation,
    useGetUserConversationsQuery,
    useGetConversationByIdQuery,
    useSendMessageMutation,
    useSendMessageAutoMutation,
    useGetConversationMessagesQuery,
    useGetMessageByIdQuery,
    useMarkAsReadMutation,
    useRejectOfferMutation,
    useConvertRequestToOfferMutation,
    useMarkConversationAsReadsMutation,
    // my unread message count
    useGetTotalUnreadCountQuery,
} = messageApi;
