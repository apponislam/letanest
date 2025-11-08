import { baseApi } from "../../api/baseApi";

export interface IMessageType {
    _id: string;
    name: string;
    type: "WELCOME" | "REMINDER" | "SYSTEM";
    content: string;
    isActive: boolean;
    variables?: ("name" | "propertyNumber")[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateMessageTypeDto {
    name: string;
    type: "WELCOME" | "REMINDER" | "SYSTEM";
    content: string;
    variables?: ("name" | "propertyNumber")[];
}

export interface UpdateMessageTypeDto {
    name?: string;
    type?: "WELCOME" | "REMINDER" | "SYSTEM";
    content?: string;
    variables?: ("name" | "propertyNumber")[];
    isActive?: boolean;
}

// Your backend sendResponse structure
interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta?: any;
}

export const messageTypesApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // === Create Message Type ===
        createMessageType: builder.mutation<ApiResponse<IMessageType>, CreateMessageTypeDto>({
            query: (body) => ({
                url: "/message-types",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["MessageTypes"],
        }),

        // === Get All Message Types ===
        getAllMessageTypes: builder.query<ApiResponse<IMessageType[]>, void>({
            query: () => ({
                url: "/message-types",
                method: "GET",
            }),
            providesTags: ["MessageTypes"],
        }),

        // === Get Message Type by ID ===
        getMessageTypeById: builder.query<ApiResponse<IMessageType>, string>({
            query: (id) => ({
                url: `/message-types/${id}`,
                method: "GET",
            }),
            providesTags: ["MessageTypes"],
        }),

        // === Get Message Type by Type ===
        getMessageTypeByType: builder.query<ApiResponse<IMessageType>, string>({
            query: (type) => ({
                url: `/message-types/type/${type}`,
                method: "GET",
            }),
            providesTags: ["MessageTypes"],
        }),

        // === Update Message Type ===
        updateMessageType: builder.mutation<ApiResponse<IMessageType>, { id: string; data: UpdateMessageTypeDto }>({
            query: ({ id, data }) => ({
                url: `/message-types/${id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["MessageTypes"],
        }),

        // === Delete Message Type ===
        deleteMessageType: builder.mutation<ApiResponse<{ success: boolean; message: string }>, string>({
            query: (id) => ({
                url: `/message-types/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["MessageTypes"],
        }),
    }),
});

export const { useCreateMessageTypeMutation, useGetAllMessageTypesQuery, useGetMessageTypeByIdQuery, useGetMessageTypeByTypeQuery, useUpdateMessageTypeMutation, useDeleteMessageTypeMutation } = messageTypesApi;
