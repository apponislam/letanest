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

export const userApi = baseApi.injectEndpoints({
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
    }),
});

export const { useGetAllUsersQuery, useGetSingleUserQuery, useUpdateUserProfileMutation } = userApi;
