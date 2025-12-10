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
    meta: {
        total: number;
        page: number;
        limit: number;
    };
    success: boolean;
    message: string;
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

export interface ICurrentSubscription {
    _id: string;
    user: string;
    subscription: string;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    stripePriceId: string;
    status: "active" | "canceled" | "past_due" | "unpaid" | "incomplete" | "trialing";
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    isFreeTier: boolean;
    cost: number;
    currency: string;
    bookingFee: number;
    commission: number;
    listingLimit: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
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
    currentSubscription?: ICurrentSubscription;
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

export interface GetMyProfileResponse {
    success: boolean;
    message: string;
    data: IUserWithSubscriptions;
}

export interface ChangeRoleRequest {
    userId: string;
    newRole: Role;
}

export interface ChangeRoleResponse {
    success: boolean;
    message: string;
    data: IUser;
}

export interface DeleteUserRequest {
    userId: string;
}

export interface DeleteUserResponse {
    success: boolean;
    message: string;
    data: IUser;
}

interface DownloadUsersExcelParams {
    year: string;
    month?: string;
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
        getAllMySubscriptions: build.query<IUserSubscriptionsResponse, void>({
            query: () => ({
                url: "/users/me/subscriptions",
                method: "GET",
            }),
            providesTags: ["MySubscriptions"],
        }),

        //  Activate Free Tier
        activateFreeTier: build.mutation<{ success: boolean; message: string; data?: any }, { subscriptionId: string }>({
            query: (data) => ({
                url: "/users/me/free-tier/activate",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MySubscriptions", "Users"],
        }),

        //  Stripe Connect Endpoints
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
        getMyProfile: build.query<any, void>({
            query: () => ({
                url: "/users/me/profile",
                method: "GET",
            }),
            providesTags: ["MyProfile"],
        }),
        getRandomAdmin: build.query<
            {
                success: boolean;
                message: string;
                data: IUser | null;
            },
            void
        >({
            query: () => ({
                url: "/users/random/admin",
                method: "GET",
            }),
            providesTags: ["RandomAdmin"],
        }),

        // Change User Role (Admin only)
        changeUserRole: build.mutation<ChangeRoleResponse, ChangeRoleRequest>({
            query: (data) => ({
                url: "/users/change-role",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        // Delete User (Admin only - soft delete)
        deleteUser: build.mutation<DeleteUserResponse, DeleteUserRequest>({
            query: (data) => ({
                url: "/users/delete",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        downloadUsersExcel: build.mutation<{ success: boolean }, DownloadUsersExcelParams>({
            async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
                try {
                    const response = await fetchWithBQ({
                        url: "/users/download-excel",
                        method: "GET",
                        params: {
                            year: params.year,
                            ...(params.month && params.month !== "all" && { month: params.month }),
                        },
                        responseHandler: (response) => response.blob(),
                    });

                    if ("error" in response) {
                        return { error: response.error as any };
                    }

                    const blob = response.data as Blob;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;

                    const fileName = `users-${params.year}${params.month && params.month !== "all" ? `-${params.month.padStart(2, "0")}` : ""}.xlsx`;
                    a.download = fileName;

                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    return { data: { success: true } };
                } catch (err: any) {
                    return { error: { message: err.message ?? "Unknown error" } };
                }
            },
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetSingleUserQuery,
    useUpdateUserProfileMutation,
    useGetAllMySubscriptionsQuery,
    useActivateFreeTierMutation,
    // 🆕 Stripe Connect hooks
    useConnectStripeAccountMutation,
    useGetStripeAccountStatusQuery,
    useGetStripeDashboardQuery,
    useDisconnectStripeAccountMutation,

    // get my profile
    useGetMyProfileQuery,
    // get random admin
    useGetRandomAdminQuery,

    //Admin management hooks
    useChangeUserRoleMutation,
    useDeleteUserMutation,
    // Download Excel hook
    useDownloadUsersExcelMutation,
} = userApi;
