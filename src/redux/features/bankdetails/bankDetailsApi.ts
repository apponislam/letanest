// import { baseApi } from "@/redux/api/baseApi";

// export interface IBankDetails {
//     _id: string;
//     userId: string;
//     accountHolderName: string;
//     accountNumber: string;
//     bankName: string;
//     accountType: "personal" | "business";
//     country: string;
//     isVerified: boolean;
//     verifiedAt?: string;
//     isActive: boolean;
//     createdAt?: string;
//     updatedAt?: string;
// }

// export interface CreateBankDetailsRequest {
//     accountHolderName: string;
//     accountNumber: string;
//     bankName: string;
//     accountType: "personal" | "business";
//     country: string;
// }

// export interface UpdateBankDetailsRequest {
//     accountHolderName?: string;
//     accountNumber?: string;
//     bankName?: string;
//     accountType?: "personal" | "business";
//     country?: string;
// }

// // Response types matching your sendResponse format
// export interface BankDetailsResponse {
//     statusCode: number;
//     success: boolean;
//     message?: string;
//     data: IBankDetails;
//     meta?: {
//         page: number;
//         limit: number;
//         total: number;
//         totalAmount?: number;
//     };
// }

// export interface BankDetailsListResponse {
//     statusCode: number;
//     success: boolean;
//     message?: string;
//     data: IBankDetails | null;
//     meta?: {
//         page: number;
//         limit: number;
//         total: number;
//         totalAmount?: number;
//     };
// }

// export interface DeleteBankDetailsResponse {
//     statusCode: number;
//     success: boolean;
//     message?: string;
//     data: null;
//     meta?: {
//         page: number;
//         limit: number;
//         total: number;
//         totalAmount?: number;
//     };
// }

// export const bankDetailsApi = baseApi.injectEndpoints({
//     overrideExisting: true,
//     endpoints: (build) => ({
//         // Create bank details
//         createBankDetails: build.mutation<BankDetailsResponse, CreateBankDetailsRequest>({
//             query: (data) => ({
//                 url: "/bank-details",
//                 method: "POST",
//                 body: data,
//             }),
//             invalidatesTags: ["MyBankDetails"],
//         }),

//         // Get my bank details
//         getMyBankDetails: build.query<BankDetailsListResponse, void>({
//             query: () => ({
//                 url: "/bank-details",
//                 method: "GET",
//             }),
//             providesTags: ["MyBankDetails"],
//         }),

//         getBankDetailsByUserId: build.query<BankDetailsListResponse, string>({
//             query: (userId) => ({
//                 url: `/bank-details/user/${userId}`,
//                 method: "GET",
//             }),
//             providesTags: (result, error, userId) => [{ type: "BankDetails", id: userId }],
//         }),

//         // Update my bank details
//         updateMyBankDetails: build.mutation<BankDetailsResponse, UpdateBankDetailsRequest>({
//             query: (data) => ({
//                 url: "/bank-details",
//                 method: "PATCH",
//                 body: data,
//             }),
//             invalidatesTags: ["MyBankDetails"],
//         }),

//         // Delete my bank details
//         deleteMyBankDetails: build.mutation<DeleteBankDetailsResponse, void>({
//             query: () => ({
//                 url: "/bank-details",
//                 method: "DELETE",
//             }),
//             invalidatesTags: ["MyBankDetails"],
//         }),
//     }),
// });

// export const { useCreateBankDetailsMutation, useGetMyBankDetailsQuery, useGetBankDetailsByUserIdQuery, useUpdateMyBankDetailsMutation, useDeleteMyBankDetailsMutation } = bankDetailsApi;

import { baseApi } from "@/redux/api/baseApi";

export interface IBankDetails {
    _id: string;
    userId: string;
    accountHolderName: string;
    accountNumber: string;
    sortCode: string; // ADDED
    bankName: string;
    accountType: "personal" | "business";
    country: string;
    iban?: string; // ADDED
    bicSwift?: string; // ADDED
    isVerified: boolean;
    verifiedAt?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBankDetailsRequest {
    accountHolderName: string;
    accountNumber: string;
    sortCode: string; // ADDED
    bankName: string;
    accountType: "personal" | "business";
    country: string;
    iban?: string; // ADDED
    bicSwift?: string; // ADDED
}

export interface UpdateBankDetailsRequest {
    accountHolderName?: string;
    accountNumber?: string;
    sortCode?: string; // ADDED
    bankName?: string;
    accountType?: "personal" | "business";
    country?: string;
    iban?: string; // ADDED
    bicSwift?: string; // ADDED
}

// Response types matching your sendResponse format
export interface BankDetailsResponse {
    statusCode: number;
    success: boolean;
    message?: string;
    data: IBankDetails;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalAmount?: number;
    };
}

export interface BankDetailsListResponse {
    statusCode: number;
    success: boolean;
    message?: string;
    data: IBankDetails | null;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalAmount?: number;
    };
}

export interface DeleteBankDetailsResponse {
    statusCode: number;
    success: boolean;
    message?: string;
    data: null;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalAmount?: number;
    };
}

export const bankDetailsApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        // Create bank details
        createBankDetails: build.mutation<BankDetailsResponse, CreateBankDetailsRequest>({
            query: (data) => ({
                url: "/bank-details",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MyBankDetails"],
        }),

        // Get my bank details
        getMyBankDetails: build.query<BankDetailsListResponse, void>({
            query: () => ({
                url: "/bank-details",
                method: "GET",
            }),
            providesTags: ["MyBankDetails"],
        }),

        getBankDetailsByUserId: build.query<BankDetailsListResponse, string>({
            query: (userId) => ({
                url: `/bank-details/user/${userId}`,
                method: "GET",
            }),
            providesTags: (result, error, userId) => [{ type: "BankDetails", id: userId }],
        }),

        // Update my bank details
        updateMyBankDetails: build.mutation<BankDetailsResponse, UpdateBankDetailsRequest>({
            query: (data) => ({
                url: "/bank-details",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["MyBankDetails"],
        }),

        // Delete my bank details
        deleteMyBankDetails: build.mutation<DeleteBankDetailsResponse, void>({
            query: () => ({
                url: "/bank-details",
                method: "DELETE",
            }),
            invalidatesTags: ["MyBankDetails"],
        }),
    }),
});

export const { useCreateBankDetailsMutation, useGetMyBankDetailsQuery, useGetBankDetailsByUserIdQuery, useUpdateMyBankDetailsMutation, useDeleteMyBankDetailsMutation } = bankDetailsApi;
