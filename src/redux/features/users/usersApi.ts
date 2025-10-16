import { baseApi } from "@/redux/api/baseApi";

// Roles constants
export const roles = {
    GUEST: "GUEST" as const,
    HOST: "HOST" as const,
    ADMIN: "ADMIN" as const,
};

export type Role = (typeof roles)[keyof typeof roles];

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImg?: string;
    role: Role;
    isActive: boolean;
    lastLogin?: string;
    isEmailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    isVerifiedByAdmin?: boolean;
    verificationStatus?: "pending" | "approved" | "rejected" | "under_review";
    address?: {
        street?: string;
        city?: string;
        country?: string;
        zip?: string;
    };
    gender?: "Male" | "Female" | "Other";
}

interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
}

interface GetUsersResponse {
    data: IUser[];
    total: number;
    page: number;
    limit: number;
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    gender: "Male" | "Female" | "Other";
    phone: string;
    address: string;
    country: string;
    city: string;
    zip: string;
    profileImg?: File;
}

interface UpdateProfileResponse {
    data: IUser;
    message: string;
}

export type IUserSubscriptionItem = {
    _id: string;
    user: string;
    subscription:
        | string
        | {
              _id: string;
              bookingFee?: number;
              bookingLimit?: number;
              commission?: number;
              freeBookings?: number;
              listingLimit?: number;
              isFreeTier?: boolean;
              cancelAtPeriodEnd?: boolean;
              currentPeriodStart?: string;
              currentPeriodEnd?: string;
              createdAt?: string;
              updatedAt?: string;
              status?: string;
              stripeCustomerId?: string;
              stripeSubscriptionId?: string;
              stripePriceId?: string;
              [key: string]: any;
          };
    status: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
};

export interface IFreeTireSub {
    _id: string;
    billingPeriod?: string;
    bookingFee?: number;
    level?: string;
    paymentLink?: string;
    type?: string;
    freeBookings?: number;
    listingLimit?: number;
    commission?: number;
}

export interface IUserWithSubscriptions {
    _id: string;
    name: string;
    email: string;
    role: Role;
    profileImg?: string;
    freeTireUsed?: boolean;
    freeTireExpiry?: string;
    freeTireSub?: IFreeTireSub;
    subscriptions?: IUserSubscriptionItem[];
}

export interface IUserSubscriptionsResponse {
    success: boolean;
    message: string;
    data: IUserWithSubscriptions;
}

// Add Stripe Connect interfaces
export interface IHostStripeAccount {
    stripeAccountId: string;
    status: "pending" | "verified" | "rejected";
    createdAt: string;
    verifiedAt?: string;
}

export interface ConnectStripeResponse {
    success: boolean;
    message: string;
    data: {
        accountId: string;
        onboardingUrl: string;
        status: string;
    };
}

export interface StripeAccountStatusResponse {
    success: boolean;
    message: string;
    data: {
        status: "pending" | "verified" | "rejected";
        stripeStatus: {
            chargesEnabled: boolean;
            payoutsEnabled: boolean;
            detailsSubmitted: boolean;
        };
        accountId: string;
    };
}

export interface StripeDashboardResponse {
    success: boolean;
    message: string;
    data: {
        dashboardUrl: string;
    };
}

export interface DisconnectStripeResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        message: string;
    };
}

export const userApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        getAllUsers: build.query<GetUsersResponse, GetUsersParams>({
            query: (params = {}) => {
                const queryString = new URLSearchParams(
                    Object.entries({
                        page: params.page?.toString() ?? "1",
                        limit: params.limit?.toString() ?? "10",
                        ...(params.search ? { search: params.search } : {}),
                        ...(params.role ? { role: params.role } : {}),
                    })
                ).toString();

                return {
                    url: `/users?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: ["Users"],
        }),

        getSingleUser: build.query({
            query: (id: string) => ({
                url: `/users/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Users", id }],
        }),
        updateUserProfile: build.mutation<UpdateProfileResponse, FormData>({
            query: (formData) => ({
                url: "/users/profile",
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["Users"],
        }),
        // NEW: Get current user subscriptions
        getMySubscriptions: build.query<IUserSubscriptionsResponse, void>({
            query: () => ({
                url: "/users/me/subscriptions",
                method: "GET",
            }),
            providesTags: ["MySubscriptions"],
        }),

        // 🆕 ✅ Activate Free Tier
        activateFreeTier: build.mutation<{ success: boolean; message: string; data?: any }, { subscriptionId: string }>({
            query: (data) => ({
                url: "/users/me/free-tier/activate",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MySubscriptions", "Users"],
        }),

        // 🆕 ✅ Stripe Connect Endpoints
        connectStripeAccount: build.mutation<ConnectStripeResponse, void>({
            query: () => ({
                url: "/users/stripe/connect",
                method: "POST",
            }),
            invalidatesTags: ["Users", "MySubscriptions"],
        }),

        getStripeAccountStatus: build.query<StripeAccountStatusResponse, void>({
            query: () => ({
                url: "/users/stripe/status",
                method: "GET",
            }),
            providesTags: ["StripeAccount"],
        }),

        getStripeDashboard: build.query<StripeDashboardResponse, void>({
            query: () => ({
                url: "/users/stripe/dashboard",
                method: "GET",
            }),
            providesTags: ["StripeAccount"],
        }),

        disconnectStripeAccount: build.mutation<DisconnectStripeResponse, void>({
            query: () => ({
                url: "/users/stripe/disconnect",
                method: "POST",
            }),
            invalidatesTags: ["Users", "StripeAccount", "MySubscriptions"],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetSingleUserQuery,
    useUpdateUserProfileMutation,
    useGetMySubscriptionsQuery,
    useActivateFreeTierMutation,
    // 🆕 Stripe Connect hooks
    useConnectStripeAccountMutation,
    useGetStripeAccountStatusQuery,
    useGetStripeDashboardQuery,
    useDisconnectStripeAccountMutation,
} = userApi;
