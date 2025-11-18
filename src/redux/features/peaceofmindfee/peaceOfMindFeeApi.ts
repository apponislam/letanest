import { baseApi } from "../../api/baseApi";

interface PeaceOfMindFee {
    _id?: string;
    fee: number;
    createdAt?: string;
    updatedAt?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}

export const peaceOfMindFeeApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // === Create or Update Peace of Mind Fee ===
        createOrUpdateFee: builder.mutation<ApiResponse<PeaceOfMindFee>, { fee: number }>({
            query: (body) => ({
                url: "/peace-of-mind-fee",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["PeaceOfMindFee"],
        }),

        // === Get Current Peace of Mind Fee ===
        getFee: builder.query<ApiResponse<PeaceOfMindFee>, void>({
            query: () => ({
                url: "/peace-of-mind-fee",
                method: "GET",
            }),
            providesTags: ["PeaceOfMindFee"],
        }),
    }),
});

export const { useCreateOrUpdateFeeMutation, useGetFeeQuery } = peaceOfMindFeeApi;
