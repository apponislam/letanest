import { baseApi } from "../../api/baseApi";

export interface IPrivacyPolicy {
    _id?: string;
    content: string;
    effectiveDate: Date;
    isActive: boolean;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const privacyPolicyApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Create or Update Privacy Policy
        createOrUpdatePrivacyPolicy: build.mutation({
            query: (data) => ({
                url: "/privacy-policy",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PrivacyPolicy"],
        }),

        // Get Privacy Policy
        getPrivacyPolicy: build.query({
            query: () => ({
                url: "/privacy-policy",
                method: "GET",
            }),
            providesTags: ["PrivacyPolicy"],
        }),

        // Update Privacy Policy
        updatePrivacyPolicy: build.mutation({
            query: (data) => ({
                url: "/privacy-policy",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["PrivacyPolicy"],
        }),
    }),
});

export const { useCreateOrUpdatePrivacyPolicyMutation, useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } = privacyPolicyApi;
