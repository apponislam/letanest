import { baseApi } from "../../api/baseApi";

export interface IPayment {
    _id: string; // string instead of ObjectId for frontend
    stripePaymentIntentId: string;

    agreedFee: number;
    bookingFee: number;
    extraFee?: number;
    totalAmount: number;

    commissionRate: number;
    commissionAmount: number;
    hostAmount: number;

    userId: string;
    propertyId: string;
    conversationId: string;
    messageId: string;

    status: "pending" | "completed" | "failed" | "canceled" | "processing" | "requires_action";
    stripePaymentStatus?: string;

    checkInDate?: string; // ISO string for frontend
    checkOutDate?: string; // ISO string for frontend
    createdAt?: string;
    paidAt?: string;
}

export interface CreatePaymentRequest {
    agreedFee: number;
    bookingFee: number;
    extraFee?: number;
    totalAmount: number;
    propertyId: string;
    conversationId: string;
    messageId: string;
    checkInDate?: string;
    checkOutDate?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}

interface CreatePaymentResponse {
    success: boolean;
    message: string;
    data: {
        payment: IPayment;
        clientSecret: string;
        paymentIntentId: string;
    } | null;
}

interface ConfirmPaymentRequest {
    paymentIntentId: string;
    paymentMethodId: string;
}

export const paymentApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        createPayment: builder.mutation<CreatePaymentResponse, CreatePaymentRequest>({
            query: (body) => ({
                url: "/property-payment/create",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["propertyPayments"],
        }),

        confirmPayment: builder.mutation<ApiResponse<IPayment>, ConfirmPaymentRequest>({
            query: ({ paymentIntentId, paymentMethodId }) => ({
                url: "/property-payment/confirm",
                method: "POST",
                body: { paymentIntentId, paymentMethodId },
                credentials: "include",
            }),
            invalidatesTags: ["propertyPayments", "Messages", "Conversations"],
        }),

        getMyPayments: builder.query<ApiResponse<IPayment[]>, void>({
            query: () => ({
                url: "/property-payment/my-payments",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["propertyPayments"],
        }),

        getPaymentById: builder.query<ApiResponse<IPayment>, string>({
            query: (id) => ({
                url: `/property-payment/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: (result, error, id) => [{ type: "propertyPayments", id }],
        }),
    }),
});

export const { useCreatePaymentMutation, useConfirmPaymentMutation, useGetMyPaymentsQuery, useGetPaymentByIdQuery } = paymentApi;
