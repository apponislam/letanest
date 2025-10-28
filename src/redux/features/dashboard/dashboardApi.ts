import { overwrite } from "zod";
import { baseApi } from "../../api/baseApi";

interface DashboardStatsResponse {
    success: boolean;
    message: string;
    data: {
        users: {
            total: number;
            growth: number;
            recent: number;
        };
        properties: {
            total: number;
            growth: number;
            recent: number;
        };
        revenue: {
            total: number;
            growth: number;
            recent: number;
        };
    } | null;
}

interface RevenueChartResponse {
    success: boolean;
    message: string;
    data: {
        year: number;
        data: Array<{
            month: string;
            revenue: number;
        }>;
        growth: {
            percentage: number;
            isPositive: boolean;
            currentYearTotal: number;
            previousYearTotal: number;
        };
    } | null;
}

interface PropertyStatusStatsResponse {
    success: boolean;
    message: string;
    data: {
        total: number;
        data: Array<{
            status: string;
            count: number;
            percentage: number;
        }>;
    } | null;
}

interface SiteStatsResponse {
    success: boolean;
    message: string;
    data: {
        publishedPropertiesCount: number;
        propertiesWithGoodRatingsCount: number;
        yearsSince2025: number;
    } | null;
}

export const dashboardApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStatsResponse, void>({
            query: () => ({
                url: "/dashboard/stats",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),
        getRevenueChartData: builder.query<RevenueChartResponse, { year?: number }>({
            query: (params) => ({
                url: "/dashboard/revenue-chart",
                method: "GET",
                params: {
                    year: params?.year,
                },
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),
        getPropertyStatusStats: builder.query<PropertyStatusStatsResponse, { propertyType?: string; startDate?: string; endDate?: string }>({
            query: (filters = {}) => ({
                url: "/dashboard/property-status",
                method: "GET",
                credentials: "include",
                params: filters,
            }),
            providesTags: ["Dashboard"],
        }),
        getSiteStats: builder.query<SiteStatsResponse, void>({
            query: () => ({
                url: "/dashboard/site-stats",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetDashboardStatsQuery, useGetRevenueChartDataQuery, useGetPropertyStatusStatsQuery, useGetSiteStatsQuery } = dashboardApi;
