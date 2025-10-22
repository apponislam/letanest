import { baseApi } from "../../api/baseApi";

export enum RatingType {
    PROPERTY = "property",
    SITE = "site",
}
// Rating interfaces for the API
interface CreateRatingData {
    type: RatingType;
    propertyId?: string;
    hostId?: string;
    communication?: number;
    accuracy?: number;
    cleanliness?: number;
    checkInExperience?: number;
    overallExperience: number;
    country?: string;
    description?: string;
}

interface Rating {
    _id: string;
    type: RatingType;
    propertyId?: string;
    hostId?: string;
    userId: string;
    communication?: number;
    accuracy?: number;
    cleanliness?: number;
    checkInExperience?: number;
    overallExperience: number;
    country?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

interface PropertyRatingStats {
    averageRating: number;
    totalRatings: number;
    communication: number;
    accuracy: number;
    cleanliness: number;
    checkInExperience: number;
    overallExperience: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

interface SiteRatingStats {
    averageRating: number;
    totalRatings: number;
    countryStats: { country: string; count: number; average: number }[];
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export const ratingApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // === Create Rating ===
        createRating: builder.mutation<
            {
                data: Rating;
                message: string;
                success: boolean;
            },
            CreateRatingData
        >({
            query: (body) => ({
                url: "/rating",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Rating", "MyRatings"],
        }),

        // === Get Property Ratings ===
        getPropertyRatings: builder.query<
            {
                data: Rating[];
                message: string;
                success: boolean;
            },
            string
        >({
            query: (propertyId) => ({
                url: `/rating/properties/${propertyId}/ratings`,
                method: "GET",
            }),
            providesTags: ["Rating"],
        }),

        // === Get Property Rating Stats ===
        getPropertyRatingStats: builder.query<
            {
                data: PropertyRatingStats;
                message: string;
                success: boolean;
            },
            string
        >({
            query: (propertyId) => ({
                url: `/rating/properties/${propertyId}/rating-stats`,
                method: "GET",
            }),
            providesTags: ["Rating"],
        }),

        // === Get User Property Rating ===
        getUserPropertyRating: builder.query<
            {
                data: Rating | null;
                message: string;
                success: boolean;
            },
            string
        >({
            query: (propertyId) => ({
                url: `/rating/properties/${propertyId}/user-rating`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Rating"],
        }),

        // === Get Host Ratings ===
        getHostRatings: builder.query<
            {
                data: Rating[];
                message: string;
                success: boolean;
            },
            string
        >({
            query: (hostId) => ({
                url: `/rating/hosts/${hostId}/ratings`,
                method: "GET",
            }),
            providesTags: ["Rating"],
        }),

        // === Get Host Rating Stats ===
        getHostRatingStats: builder.query<
            {
                data: PropertyRatingStats;
                message: string;
                success: boolean;
            },
            string
        >({
            query: (hostId) => ({
                url: `/rating/hosts/${hostId}/rating-stats`,
                method: "GET",
            }),
            providesTags: ["Rating"],
        }),

        // === Get User Host Ratings ===
        getUserHostRatings: builder.query<
            {
                data: Rating[];
                message: string;
                success: boolean;
            },
            string
        >({
            query: (hostId) => ({
                url: `/rating/hosts/${hostId}/user-ratings`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Rating"],
        }),

        // === Get Site Ratings ===
        getSiteRatings: builder.query<
            {
                data: Rating[];
                message: string;
                success: boolean;
                meta?: {
                    page: number;
                    limit: number;
                    total: number;
                };
            },
            { page?: number; limit?: number }
        >({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: `/rating/site-ratings?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Rating"],
        }),

        // === Get Site Rating Stats ===
        getSiteRatingStats: builder.query<
            {
                data: SiteRatingStats;
                message: string;
                success: boolean;
            },
            void
        >({
            query: () => ({
                url: "/rating/site-rating-stats",
                method: "GET",
            }),
            providesTags: ["Rating"],
        }),

        // === Get User Site Rating ===
        getUserSiteRating: builder.query<
            {
                data: Rating | null;
                message: string;
                success: boolean;
            },
            void
        >({
            query: () => ({
                url: "/rating/site-ratings/user-rating",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Rating"],
        }),

        // === Update Rating ===
        updateRating: builder.mutation<
            {
                data: Rating;
                message: string;
                success: boolean;
            },
            { id: string; data: Partial<Rating> }
        >({
            query: ({ id, data }) => ({
                url: `/rating/${id}`,
                method: "PATCH",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Rating"],
        }),

        // === Delete Rating ===
        deleteRating: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/rating/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Rating"],
        }),

        // === NEW: Get All Ratings for Admin ===
        getAllRatingsForAdmin: builder.query<
            {
                data: Rating[];
                message: string;
                success: boolean;
                meta?: {
                    page: number;
                    limit: number;
                    total: number;
                };
            },
            {
                type?: RatingType;
                page?: number;
                limit?: number;
                sortBy?: string;
                sortOrder?: "asc" | "desc";
                search?: string;
            }
        >({
            query: ({ type, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search } = {}) => {
                const params = new URLSearchParams();
                if (type) params.append("type", type);
                params.append("page", page.toString());
                params.append("limit", limit.toString());
                params.append("sortBy", sortBy);
                params.append("sortOrder", sortOrder);
                if (search) params.append("search", search);

                return {
                    url: `/rating/admin/all-ratings?${params.toString()}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["Rating"],
        }),

        // === NEW: Get Admin Rating Stats ===
        getAdminRatingStats: builder.query<
            {
                data: {
                    totalRatings: number;
                    siteRatings: number;
                    propertyRatings: number;
                    averageSiteRating: number;
                    averagePropertyRating: number;
                    recentRatings: Rating[];
                };
                message: string;
                success: boolean;
            },
            void
        >({
            query: () => ({
                url: "/rating/admin/rating-stats",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Rating"],
        }),
        checkUserPropertiesRating: builder.mutation<
            {
                success: boolean;
                message: string;
                data: { propertyId: string; hasRated: boolean }[];
            },
            { propertyIds: string[] }
        >({
            query: ({ propertyIds }) => ({
                url: `/rating/check-user-ratings`,
                method: "POST",
                body: { propertyIds },
            }),
            invalidatesTags: ["MyRatings"],
        }),
    }),
});

export const {
    useCreateRatingMutation,
    useGetPropertyRatingsQuery,
    useGetPropertyRatingStatsQuery,
    useGetUserPropertyRatingQuery,
    useGetHostRatingsQuery,
    useGetHostRatingStatsQuery,
    useGetUserHostRatingsQuery,
    useGetSiteRatingsQuery,
    useGetSiteRatingStatsQuery,
    useGetUserSiteRatingQuery,
    useUpdateRatingMutation,
    useDeleteRatingMutation,
    useGetAllRatingsForAdminQuery,
    useGetAdminRatingStatsQuery,
    // my ratings check
    useCheckUserPropertiesRatingMutation,
} = ratingApi;
