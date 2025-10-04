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
    }),
});

export const { useGetAllUsersQuery, useGetSingleUserQuery } = userApi;
