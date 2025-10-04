import { TermsAndConditions } from "@/types/terms";
import { baseApi } from "../../api/baseApi";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}

export const termsApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // === Create Terms ===
        createTerms: builder.mutation<
            {
                data: TermsAndConditions;
                message: string;
                success: boolean;
            },
            Partial<TermsAndConditions>
        >({
            query: (body) => ({
                url: "/public",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Terms"],
        }),

        // === Get All Terms ===
        getAllTerms: builder.query<TermsAndConditions[], void>({
            query: () => ({
                url: "/public",
                method: "GET",
            }),
            providesTags: ["Terms"],
        }),

        // === Get Term by ID ===
        getTermById: builder.query<TermsAndConditions, string>({
            query: (id) => ({
                url: `/public/${id}`,
                method: "GET",
            }),
            providesTags: ["Terms"],
        }),

        // === Get Default Host Terms ===
        getDefaultHostTerms: builder.query<ApiResponse<TermsAndConditions>, void>({
            query: () => ({
                url: "/public/host/default",
                method: "GET",
            }),
            providesTags: ["Terms"],
        }),

        // === Update Term ===
        updateTerm: builder.mutation<TermsAndConditions, { id: string; data: Partial<TermsAndConditions> }>({
            query: ({ id, data }) => ({
                url: `/public/${id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Terms"],
        }),

        // === Delete Term ===
        deleteTerm: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/public/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Terms"],
        }),

        // === Get Terms by Target (Guest / Host) ===
        getTermsByTarget: builder.query<ApiResponse<TermsAndConditions[]>, string>({
            query: (target) => ({
                url: `/public/target/${target}`,
                method: "GET",
            }),
            providesTags: ["Terms"],
        }),

        // === Get Property-specific Terms ===
        getTermsByProperty: builder.query<TermsAndConditions, string>({
            query: (propertyId) => ({
                url: `/public/property/${propertyId}`,
                method: "GET",
            }),
            providesTags: ["Terms"],
        }),
    }),
});

export const { useCreateTermsMutation, useGetAllTermsQuery, useGetTermByIdQuery, useGetDefaultHostTermsQuery, useUpdateTermMutation, useDeleteTermMutation, useGetTermsByTargetQuery, useGetTermsByPropertyQuery } = termsApi;
