import { baseApi } from "@/redux/api/baseApi";

export interface IPageConfig {
    _id: string;
    pageType: "signin" | "signup";
    title: string;
    logo?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetPageConfigResponse {
    success: boolean;
    message: string;
    data: IPageConfig | null;
}

export interface GetAllPageConfigsResponse {
    success: boolean;
    message: string;
    data: IPageConfig[];
}

export interface UpdatePageConfigRequest {
    title?: string;
    logo?: string;
    isActive?: boolean;
}

export const pageConfigApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Public - Get page configuration
        getPageConfig: build.query<GetPageConfigResponse, { pageType: "signin" | "signup" }>({
            query: ({ pageType }) => ({
                url: `/page-config/${pageType}`,
                method: "GET",
            }),
            providesTags: ["PageConfig"],
        }),

        // Public - Get all page configurations
        getAllPageConfigs: build.query<GetAllPageConfigsResponse, void>({
            query: () => ({
                url: "/page-config",
                method: "GET",
            }),
            providesTags: ["PageConfig"],
        }),

        // Admin - Update page configuration with file upload
        updatePageConfig: build.mutation<
            GetPageConfigResponse,
            {
                pageType: "signin" | "signup";
                data: FormData;
            }
        >({
            query: ({ pageType, data }) => ({
                url: `/page-config/${pageType}`,
                method: "PATCH",
                body: data,
                headers: {},
            }),
            invalidatesTags: ["PageConfig"],
        }),

        // Admin - Delete page configuration
        deletePageConfig: build.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/page-config/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PageConfig"],
        }),
    }),
});

export const { useGetPageConfigQuery, useGetAllPageConfigsQuery, useUpdatePageConfigMutation, useDeletePageConfigMutation } = pageConfigApi;
