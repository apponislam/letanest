import { baseApi } from "@/redux/api/baseApi";

export interface ISubscriptionFeature {
    name: string;
    included: boolean;
}

export interface ISubscription {
    _id?: string;
    name: string;
    type: "GUEST" | "HOST";
    level: "free" | "premium" | "gold";
    billingPeriod: "monthly" | "annual" | "none";

    // Pricing
    cost: number;
    currency: string;

    // Guest specific
    bookingFee?: number | undefined;
    bookingLimit?: number;

    // Host specific
    commission?: number;
    freeBookings?: number;
    listingLimit?: number;

    // Stripe Integration
    stripeProductId: string;
    stripePriceId: string;
    paymentLink: string;

    // Features
    features: ISubscriptionFeature[];
    badge?: string;

    // Metadata
    description: string;
    isActive: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

// Base API response wrapper
interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Subscription interfaces
export interface GetSubscriptionsParams {
    page?: number;
    limit?: number;
    type?: "GUEST" | "HOST";
    level?: string;
    isActive?: string;
}

export interface GetSubscriptionsResponse {
    data: ISubscription[]; // Fixed: changed from 'data' to 'subscriptions'
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Fixed: Made bookingFee and commission optional to match ISubscription
export interface CreateSubscriptionRequest {
    name: string;
    type: "GUEST" | "HOST";
    level: "free" | "premium" | "gold";
    billingPeriod: "monthly" | "annual" | "none";
    cost: number;
    currency: string;
    bookingFee?: number; // Made optional
    bookingLimit?: number;
    commission?: number; // Made optional
    freeBookings?: number;
    listingLimit?: number;
    description: string;
    features: ISubscriptionFeature[];
    badge?: string;
    isActive: boolean;
}

export interface UpdateSubscriptionRequest {
    name?: string;
    type?: "GUEST" | "HOST";
    level?: "free" | "premium" | "gold";
    billingPeriod?: "monthly" | "annual" | "none";
    cost?: number;
    currency?: string;
    bookingFee?: number;
    bookingLimit?: number;
    commission?: number;
    freeBookings?: number;
    listingLimit?: number;
    description?: string;
    features?: ISubscriptionFeature[];
    badge?: string;
    isActive?: boolean;
}

export const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all subscriptions
        getAllSubscriptions: build.query<GetSubscriptionsResponse, GetSubscriptionsParams>({
            query: (params = {}) => {
                const queryString = new URLSearchParams(
                    Object.entries({
                        page: params.page?.toString() ?? "1",
                        limit: params.limit?.toString() ?? "10",
                        ...(params.type ? { type: params.type } : {}),
                        ...(params.level ? { level: params.level } : {}),
                        ...(params.isActive ? { isActive: params.isActive } : {}),
                    })
                ).toString();

                return {
                    url: `/subscriptions?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (response: ApiResponse<GetSubscriptionsResponse>) => response.data,
            providesTags: ["Subscriptions"],
        }),

        getAllSubscriptionsAdmin: build.query<ISubscription[], GetSubscriptionsParams>({
            query: (params = {}) => {
                const queryString = new URLSearchParams(
                    Object.entries({
                        page: params.page?.toString() ?? "1",
                        limit: params.limit?.toString() ?? "10",
                        ...(params.type ? { type: params.type } : {}),
                        ...(params.level ? { level: params.level } : {}),
                    })
                ).toString();

                return {
                    url: `/subscriptions/admin?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (response: ApiResponse<ISubscription[]>) => response.data,
            providesTags: ["Subscriptions"],
        }),

        // Get subscriptions by type
        getSubscriptionsByType: build.query<ISubscription[], string>({
            query: (type: string) => ({
                url: `/subscriptions/type/${type}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<ISubscription[]>) => response.data,
            providesTags: ["Subscriptions"],
        }),

        // Get subscriptions by type
        getSubscriptionsByTypeForAdmin: build.query<ISubscription[], string>({
            query: (type: string) => ({
                url: `/subscriptions/admin/type/${type}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<ISubscription[]>) => response.data,
            providesTags: ["Subscriptions"],
        }),

        // Get subscription by type and level
        getSubscriptionByTypeAndLevel: build.query<ISubscription[], { type: string; level: string }>({
            query: ({ type, level }) => ({
                url: `/subscriptions/type/${type}/level/${level}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<ISubscription[]>) => response.data,
            providesTags: (result, error, { type, level }) => [{ type: "Subscriptions", id: `${type}_${level}` }],
        }),

        // Get default subscription by type
        getDefaultSubscription: build.query<ISubscription, string>({
            query: (type: string) => ({
                url: `/subscriptions/default/${type}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<ISubscription>) => response.data,
            providesTags: (result, error, type) => [{ type: "Subscriptions", id: `default_${type}` }],
        }),

        // Get single subscription by ID
        getSingleSubscription: build.query<ISubscription, string>({
            query: (id: string) => ({
                url: `/subscriptions/${id}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<ISubscription>) => response.data,
            providesTags: (result, error, id) => [{ type: "Subscriptions", id }],
        }),

        // Create subscription (Admin only)
        createSubscription: build.mutation<{ data: ISubscription; message: string }, CreateSubscriptionRequest>({
            query: (subscriptionData) => ({
                url: "/subscriptions",
                method: "POST",
                body: subscriptionData,
            }),
            transformResponse: (response: ApiResponse<ISubscription>) => ({
                data: response.data,
                message: response.message,
            }),
            invalidatesTags: ["Subscriptions"],
        }),

        // Update subscription (Admin only)
        updateSubscription: build.mutation<{ data: ISubscription; message: string }, { id: string; data: UpdateSubscriptionRequest }>({
            query: ({ id, data }) => ({
                url: `/subscriptions/${id}`,
                method: "PATCH",
                body: data,
            }),
            transformResponse: (response: ApiResponse<ISubscription>) => ({
                data: response.data,
                message: response.message,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Subscriptions", id }, "Subscriptions"],
        }),

        // Toggle subscription status (Admin only)
        toggleSubscriptionStatus: build.mutation<{ data: ISubscription; message: string }, string>({
            query: (id: string) => ({
                url: `/subscriptions/${id}/toggle-status`,
                method: "PATCH",
            }),
            transformResponse: (response: ApiResponse<ISubscription>) => ({
                data: response.data,
                message: response.message,
            }),
            invalidatesTags: (result, error, id) => [{ type: "Subscriptions", id }, "Subscriptions"],
        }),
        createCheckoutSession: build.mutation<{ data: { url: string }; message: string }, { subscriptionId: string }>({
            query: (data: { subscriptionId: string }) => ({
                url: `/subscriptions/create-checkout-session`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ApiResponse<{ url: string }>) => ({
                data: response.data,
                message: response.message,
            }),
        }),
        getCheckoutSession: build.query<any, string>({
            query: (sessionId: string) => ({
                url: `/subscriptions/session/${sessionId}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<any>) => response.data,
            providesTags: (result, error, sessionId) => [{ type: "Subscriptions", id: `session_${sessionId}` }],
        }),
        deleteSubscription: build.mutation<{ data: ISubscription; message: string }, string>({
            query: (id: string) => ({
                url: `/subscriptions/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response: ApiResponse<ISubscription>) => ({
                data: response.data,
                message: response.message,
            }),
            invalidatesTags: ["Subscriptions"],
        }),
    }),
});

export const {
    useGetAllSubscriptionsQuery,
    useGetAllSubscriptionsAdminQuery,
    useGetSubscriptionsByTypeQuery,
    useGetSubscriptionsByTypeForAdminQuery,
    useGetSubscriptionByTypeAndLevelQuery,
    useGetDefaultSubscriptionQuery,
    useGetSingleSubscriptionQuery,
    useCreateSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useToggleSubscriptionStatusMutation,
    useCreateCheckoutSessionMutation,
    useGetCheckoutSessionQuery,
    useDeleteSubscriptionMutation,
} = subscriptionApi;
