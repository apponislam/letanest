import { baseApi } from "@/redux/api/baseApi";

export interface IUserSubscription {
    _id?: string;
    user: string; // Types.ObjectId as string
    subscription: string; // Types.ObjectId as string
    stripeSubscriptionId?: string;
    stripeCustomerId: string;
    stripePriceId: string;
    status: "active" | "canceled" | "past_due" | "unpaid" | "incomplete";
    currentPeriodStart: string; // Date as string
    currentPeriodEnd: string; // Date as string
    cancelAtPeriodEnd: boolean;
    isFreeTier: boolean;
    cost?: number;
    currency?: string;
    bookingFee?: number;
    bookingLimit?: number;
    commission?: number;
    freeBookings?: number;
    listingLimit?: number;
    createdAt?: string; // Date as string
    updatedAt?: string; // Date as string
}

export interface CreateUserSubscriptionData {
    userId: string;
    subscriptionId: string;
    stripeSubscriptionId?: string;
    stripeCustomerId: string;
    stripePriceId: string;
    status: IUserSubscription["status"];
    currentPeriodStart: string; // Date as string
    currentPeriodEnd: string; // Date as string
    cancelAtPeriodEnd: boolean;
    isFreeTier: boolean;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalAmount?: number;
    };
}

const subscribedApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Create user subscription
        createUserSubscription: builder.mutation<ApiResponse<IUserSubscription>, CreateUserSubscriptionData>({
            query: (subscriptionData) => ({
                url: "/subscriptions",
                method: "POST",
                body: subscriptionData,
            }),
            invalidatesTags: ["UserSubscription"],
        }),

        // Get my subscriptions
        getMySubscriptions: builder.query<ApiResponse<IUserSubscription[]>, void>({
            query: () => ({
                url: "/subscriptions/my-subscriptions",
                method: "GET",
            }),
            providesTags: ["UserSubscription"],
        }),

        // Get my active subscription
        getMyActiveSubscription: builder.query<ApiResponse<IUserSubscription | null>, void>({
            query: () => ({
                url: "/subscriptions/active",
                method: "GET",
            }),
            providesTags: ["UserSubscription"],
        }),

        // Get subscription by ID
        getUserSubscription: builder.query<ApiResponse<IUserSubscription>, string>({
            query: (id) => ({
                url: `/subscriptions/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "UserSubscription", id }],
        }),

        // Cancel subscription
        cancelSubscription: builder.mutation<ApiResponse<IUserSubscription>, string>({
            query: (id) => ({
                url: `/subscribed/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["UserSubscription", "MySubscriptions"],
        }),

        // Update subscription status
        updateSubscriptionStatus: builder.mutation<ApiResponse<IUserSubscription>, { id: string; status: IUserSubscription["status"] }>({
            query: ({ id, status }) => ({
                url: `/subscriptions/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "UserSubscription", id }, "UserSubscription"],
        }),
    }),
});

export const { useCreateUserSubscriptionMutation, useGetMySubscriptionsQuery, useGetMyActiveSubscriptionQuery, useGetUserSubscriptionQuery, useCancelSubscriptionMutation, useUpdateSubscriptionStatusMutation } = subscribedApi;

export default subscribedApi;
