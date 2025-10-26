import { baseApi } from "@/redux/api/baseApi";

export interface IPaymentMethod {
    _id: string;
    userId: string;
    stripeCustomerId: string;
    paymentMethodId: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IUserInfo {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImg?: string;
}

export interface IPaymentMethodWithUser extends Omit<IPaymentMethod, "userId"> {
    userId: IUserInfo;
}

// Request types
export interface CreatePaymentMethodRequest {
    paymentMethodId: string;
    isDefault?: boolean;
}

export interface SetDefaultRequest {
    paymentMethodId: string;
}

// Response types matching sendResponse structure
export interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string;
    data: T;
}

export interface GetPaymentMethodsResponse extends ApiResponse<IPaymentMethod[] | IPaymentMethodWithUser[]> {}
export interface GetDefaultPaymentMethodResponse extends ApiResponse<IPaymentMethod | null> {}
export interface CreatePaymentMethodResponse extends ApiResponse<IPaymentMethod> {}
export interface SetDefaultResponse extends ApiResponse<IPaymentMethod> {}
export interface DeletePaymentMethodResponse extends ApiResponse<null> {}

export const paymentMethodApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Create payment method
        createPaymentMethod: build.mutation<CreatePaymentMethodResponse, CreatePaymentMethodRequest>({
            query: (data) => ({
                url: "/payment-methods",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PaymentMethods"],
        }),

        // Get user's payment methods
        getPaymentMethods: build.query<GetPaymentMethodsResponse, void>({
            query: () => ({
                url: "/payment-methods",
                method: "GET",
            }),
            providesTags: ["PaymentMethods"],
        }),

        // Get default payment method
        getDefaultPaymentMethod: build.query<GetDefaultPaymentMethodResponse, void>({
            query: () => ({
                url: "/payment-methods/default",
                method: "GET",
            }),
            providesTags: ["PaymentMethods"],
        }),

        // Set payment method as default
        setDefaultPaymentMethod: build.mutation<SetDefaultResponse, string>({
            query: (paymentMethodId) => ({
                url: `/payment-methods/${paymentMethodId}/set-default`,
                method: "PATCH",
            }),
            invalidatesTags: ["PaymentMethods"],
        }),

        // Delete payment method
        deletePaymentMethod: build.mutation<DeletePaymentMethodResponse, string>({
            query: (paymentMethodId) => ({
                url: `/payment-methods/${paymentMethodId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PaymentMethods"],
        }),
    }),
});

export const { useCreatePaymentMethodMutation, useGetPaymentMethodsQuery, useGetDefaultPaymentMethodQuery, useSetDefaultPaymentMethodMutation, useDeletePaymentMethodMutation } = paymentMethodApi;
