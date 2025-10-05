// verification.api.ts
import { baseApi } from "@/redux/api/baseApi";

// Verification status constants
export const verificationStatus = {
    PENDING: "pending" as const,
    APPROVED: "approved" as const,
    REJECTED: "rejected" as const,
    UNDER_REVIEW: "under_review" as const,
};

export type VerificationStatus = (typeof verificationStatus)[keyof typeof verificationStatus];

export interface IFileInfo {
    filename: string;
    originalName: string;
    path: string;
    mimetype: string;
    size: number;
}

export interface IVerification {
    _id: string;
    firstName: string;
    lastName: string;
    dob: string;
    countryOfBirth: string;
    cityOfBirth: string;
    zip: string;
    proofAddress: IFileInfo;
    proofID: IFileInfo;
    status: VerificationStatus;
    submittedAt: string;
    reviewedAt?: string;
    reviewNotes?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUserInfo {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface IVerificationWithUser extends Omit<IVerification, "userId"> {
    userId: IUserInfo;
}

// Request types
export interface SubmitVerificationRequest {
    firstName: string;
    lastName: string;
    dob: string;
    countryOfBirth: string;
    cityOfBirth: string;
    zip: string;
    proofAddress: File;
    proofID: File;
}

export interface UpdateStatusRequest {
    status: VerificationStatus;
    reviewNotes?: string;
}

// Query params
export interface GetVerificationsParams {
    page?: number;
    limit?: number;
    status?: string;
}

// Response types
export interface GetVerificationsResponse {
    data: IVerification[] | IVerificationWithUser[];
    total: number;
    page: number;
    limit: number;
}

export interface SubmitVerificationResponse {
    data: IVerification;
    message: string;
}

export interface UpdateStatusResponse {
    data: IVerificationWithUser;
    message: string;
}

export const verificationApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Submit verification
        submitVerification: build.mutation<SubmitVerificationResponse, FormData>({
            query: (formData) => ({
                url: "/verifications/submit",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Verifications"],
        }),

        // Get user's verifications
        getUserVerifications: build.query<GetVerificationsResponse, GetVerificationsParams>({
            query: (params = {}) => {
                const queryString = new URLSearchParams(
                    Object.entries({
                        page: params.page?.toString() ?? "1",
                        limit: params.limit?.toString() ?? "10",
                        ...(params.status ? { status: params.status } : {}),
                    })
                ).toString();

                return {
                    url: `/verifications/my-verifications?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: ["Verifications"],
        }),

        // Get single verification
        getSingleVerification: build.query({
            query: (id: string) => ({
                url: `/verifications/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Verifications", id }],
        }),

        // Get all verifications (Admin only)
        getAllVerifications: build.query<GetVerificationsResponse, GetVerificationsParams>({
            query: (params = {}) => {
                const queryString = new URLSearchParams(
                    Object.entries({
                        page: params.page?.toString() ?? "1",
                        limit: params.limit?.toString() ?? "10",
                        ...(params.status ? { status: params.status } : {}),
                    })
                ).toString();

                return {
                    url: `/verifications?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: ["Verifications"],
        }),

        // Update verification status (Admin only)
        updateVerificationStatus: build.mutation<UpdateStatusResponse, { id: string; data: UpdateStatusRequest }>({
            query: ({ id, data }) => ({
                url: `/verifications/${id}/status`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Verifications", id }, "Verifications"],
        }),

        // Delete verification
        deleteVerification: build.mutation({
            query: (id: string) => ({
                url: `/verifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Verifications"],
        }),

        // Serve file (this would typically be handled directly by the browser)
        getVerificationFile: build.query({
            query: ({ id, fileType }: { id: string; fileType: "proofAddress" | "proofID" }) => ({
                url: `/verifications/${id}/files/${fileType}`,
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
});

export const { useSubmitVerificationMutation, useGetUserVerificationsQuery, useGetSingleVerificationQuery, useGetAllVerificationsQuery, useUpdateVerificationStatusMutation, useDeleteVerificationMutation, useGetVerificationFileQuery } = verificationApi;
