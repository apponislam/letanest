import { baseApi } from "@/redux/api/baseApi";
import { IProperty } from "@/types/property";

interface GetPropertiesQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    createdBy?: string;
    propertyType?: string;
    type?: "featured" | "trending";
}

interface GetPropertiesResponse {
    data: IProperty[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        totalAmount?: number;
    };
}

export const propertyApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        // Get all properties with pagination & filters
        getAllProperties: build.query<GetPropertiesResponse, GetPropertiesQuery | void>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params) {
                    Object.entries(params).forEach(([key, value]) => {
                        if (value !== undefined) searchParams.append(key, value.toString());
                    });
                }
                return {
                    url: `/property?${searchParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Properties"],
        }),

        // Get single property
        getSingleProperty: build.query<
            {
                success: boolean;
                message: string;
                data: IProperty;
            },
            string
        >({
            query: (id) => ({
                url: `/property/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Properties", id }],
        }),

        // Create property
        createProperty: build.mutation<any, FormData>({
            query: (formData) => ({
                url: "/property",
                method: "POST",
                body: formData,
                // IMPORTANT: let the browser set Content-Type automatically
            }),
            invalidatesTags: ["Properties"],
        }),

        // Update property
        updateProperty: build.mutation<IProperty, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/property/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Properties"],
        }),

        getPublishedPropertiesForAdmin: build.query<GetPropertiesResponse, GetPropertiesQuery | void>({
            query: (params = {}) => {
                // Set default values
                const defaultParams = {
                    page: 1,
                    limit: 1,
                    ...params,
                };

                const searchParams = new URLSearchParams();
                Object.entries(defaultParams).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        searchParams.append(key, value.toString());
                    }
                });

                return {
                    url: `/property/admin/published?${searchParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Properties"],
        }),

        getAllPropertiesForAdmin: build.query<GetPropertiesResponse, GetPropertiesQuery | void>({
            query: (params = {}) => {
                // Set default values
                const defaultParams = {
                    page: 1,
                    limit: 1,
                    ...params,
                };

                const searchParams = new URLSearchParams();
                Object.entries(defaultParams).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        searchParams.append(key, value.toString());
                    }
                });

                return {
                    url: `/property/admin/all?${searchParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Properties"],
        }),

        changePropertyStatus: build.mutation<IProperty, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/property/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Properties"],
        }),

        // Host

        getHostProperties: build.query<GetPropertiesResponse, GetPropertiesQuery | void>({
            query: (params = {}) => {
                const defaultParams = {
                    page: 1,
                    limit: 10,
                    ...params,
                };

                const searchParams = new URLSearchParams();
                Object.entries(defaultParams).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        searchParams.append(key, value.toString());
                    }
                });

                return {
                    url: `/property/host/my-properties?${searchParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Properties"],
        }),

        deleteHostProperty: build.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/property/host/my-properties/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Properties"],
        }),

        getMyPublishedProperties: build.query<any, void>({
            query: () => ({
                url: `/property/host/my-published-properties`,
                method: "GET",
            }),
            providesTags: ["Properties"],
        }),
        searchMyPublishedProperties: build.query<any, { page?: number; limit?: number; search?: string }>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();
                searchParams.append("page", (params.page || 1).toString());
                searchParams.append("limit", (params.limit || 10).toString());
                if (params?.search) searchParams.append("search", params.search);

                return {
                    url: `/property/host/search-published-properties?${searchParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Properties"],
        }),
        getMaxRoundedPrice: build.query<
            {
                success: boolean;
                message: string;
                data: {
                    maxRoundedPrice: number;
                };
            },
            void
        >({
            query: () => ({
                url: `/property/property/max-price`,
                method: "GET",
            }),
        }),
        togglePropertyFeatured: build.mutation<IProperty, string>({
            query: (id) => ({
                url: `/property/${id}/toggle-featured`,
                method: "PATCH",
            }),
            invalidatesTags: ["Properties"],
        }),

        togglePropertyTrending: build.mutation<IProperty, string>({
            query: (id) => ({
                url: `/property/${id}/toggle-trending`,
                method: "PATCH",
            }),
            invalidatesTags: ["Properties"],
        }),
    }),
});

export const {
    useGetAllPropertiesQuery,
    useGetSinglePropertyQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useGetPublishedPropertiesForAdminQuery,
    useGetAllPropertiesForAdminQuery,
    useChangePropertyStatusMutation,
    // Host endpoints exports
    useGetHostPropertiesQuery,
    useDeleteHostPropertyMutation,
    useGetMyPublishedPropertiesQuery,
    useSearchMyPublishedPropertiesQuery,

    // max price
    useGetMaxRoundedPriceQuery,

    // Toggles
    useTogglePropertyFeaturedMutation,
    useTogglePropertyTrendingMutation,
} = propertyApi;
