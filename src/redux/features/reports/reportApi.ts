// import { baseApi } from "@/redux/api/baseApi";

// export interface IReport {
//     _id: string;
//     guestId: {
//         _id: string;
//         name: string;
//         email: string;
//         profileImg?: string;
//     };
//     hostId: {
//         _id: string;
//         name: string;
//         email: string;
//         profileImg?: string;
//     };
//     reason: string;
//     message: string;
//     status: "pending" | "resolved";
//     createdAt: string;
//     updatedAt: string;
// }

// export interface CreateReportRequest {
//     hostId: string;
//     reason: string;
//     message: string;
// }

// export const reportApi = baseApi.injectEndpoints({
//     endpoints: (build) => ({
//         createReport: build.mutation<{ success: boolean; message: string; data: IReport }, CreateReportRequest>({
//             query: (data) => ({
//                 url: "/reports",
//                 method: "POST",
//                 body: data,
//             }),
//             invalidatesTags: ["Reports"],
//         }),

//         getMyReports: build.query<{ success: boolean; message: string; data: IReport[] }, void>({
//             query: () => ({
//                 url: "/reports/my-reports",
//                 method: "GET",
//             }),
//             providesTags: ["Reports"],
//         }),

//         getHostReports: build.query<{ success: boolean; message: string; data: IReport[] }, string>({
//             query: (hostId) => ({
//                 url: `/reports/host/${hostId}`,
//                 method: "GET",
//             }),
//             providesTags: ["Reports"],
//         }),

//         // Admin endpoints
//         getAllReports: build.query<
//             {
//                 success: boolean;
//                 message: string;
//                 data: IReport[];
//                 meta: {
//                     page: number;
//                     limit: number;
//                     total: number;
//                 };
//             },
//             { page?: number; limit?: number; status?: "pending" | "resolved" }
//         >({
//             query: (params) => ({
//                 url: "/reports",
//                 method: "GET",
//                 params: params,
//             }),
//             providesTags: ["Reports"],
//         }),

//         updateReportStatus: build.mutation<{ success: boolean; message: string; data: IReport }, { reportId: string; status: "pending" | "resolved" }>({
//             query: ({ reportId, status }) => ({
//                 url: `/reports/${reportId}/status`,
//                 method: "PATCH",
//                 body: { status },
//             }),
//             invalidatesTags: ["Reports"],
//         }),

//         getReportStats: build.query<{ success: boolean; message: string; data: { total: number; pending: number; resolved: number } }, void>({
//             query: () => ({
//                 url: "/reports/stats",
//                 method: "GET",
//             }),
//             providesTags: ["Reports"],
//         }),
//     }),
// });

// export const { useCreateReportMutation, useGetMyReportsQuery, useGetHostReportsQuery, useGetAllReportsQuery, useUpdateReportStatusMutation, useGetReportStatsQuery } = reportApi;

import { baseApi } from "@/redux/api/baseApi";

export interface IReport {
    _id: string;
    reporterId: {
        _id: string;
        name: string;
        email: string;
        profileImg?: string;
        role: string;
    };
    reportedUserId: {
        _id: string;
        name: string;
        email: string;
        profileImg?: string;
        role: string;
    };
    conversationId?: {
        _id: string;
        participants: string[];
    };
    reason: string;
    message: string;
    status: "pending" | "resolved" | "dismissed";
    createdAt: string;
    updatedAt: string;
}

export interface CreateReportRequest {
    reportedUserId: string; // Changed from hostId to reportedUserId
    conversationId?: string; // Added optional conversationId
    reason: string;
    message: string;
}

export const reportApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createReport: build.mutation<{ success: boolean; message: string; data: IReport }, CreateReportRequest>({
            query: (data) => ({
                url: "/reports",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Reports"],
        }),

        getMyReports: build.query<{ success: boolean; message: string; data: IReport[] }, void>({
            query: () => ({
                url: "/reports/my-reports",
                method: "GET",
            }),
            providesTags: ["Reports"],
        }),

        getReportsAgainstMe: build.query<{ success: boolean; message: string; data: IReport[] }, void>({
            query: () => ({
                url: "/reports/reports-against-me",
                method: "GET",
            }),
            providesTags: ["Reports"],
        }),

        // Admin endpoints
        getAllReports: build.query<
            {
                success: boolean;
                message: string;
                data: IReport[];
                meta: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            },
            { page?: number; limit?: number; status?: "pending" | "resolved" | "dismissed" }
        >({
            query: (params) => ({
                url: "/reports",
                method: "GET",
                params: params,
            }),
            providesTags: ["Reports"],
        }),

        updateReportStatus: build.mutation<{ success: boolean; message: string; data: IReport }, { reportId: string; status: "pending" | "resolved" | "dismissed" }>({
            query: ({ reportId, status }) => ({
                url: `/reports/${reportId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Reports"],
        }),

        getReportStats: build.query<
            {
                success: boolean;
                message: string;
                data: {
                    total: number;
                    pending: number;
                    resolved: number;
                    dismissed: number;
                };
            },
            void
        >({
            query: () => ({
                url: "/reports/stats",
                method: "GET",
            }),
            providesTags: ["Reports"],
        }),
    }),
});

export const { useCreateReportMutation, useGetMyReportsQuery, useGetReportsAgainstMeQuery, useGetAllReportsQuery, useUpdateReportStatusMutation, useGetReportStatsQuery } = reportApi;
