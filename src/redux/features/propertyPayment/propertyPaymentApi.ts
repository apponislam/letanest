import { baseApi } from "../../api/baseApi";

export interface IPayment {
    _id: string; // string instead of ObjectId for frontend
    stripePaymentIntentId: string;

    agreedFee: number;
    bookingFee: number;
    extraFee?: number;
    totalAmount: number;

    commissionRate: number;
    commissionAmount: number;
    hostAmount: number;
    platFormTotal: number;

    userId: string;
    propertyId: string;
    conversationId: string;
    messageId: string;

    status: "pending" | "completed" | "failed" | "canceled" | "processing" | "requires_action";
    stripePaymentStatus?: string;

    checkInDate?: string; // ISO string for frontend
    checkOutDate?: string; // ISO string for frontend
    createdAt?: string;
    paidAt?: string;
}

export interface CreatePaymentRequest {
    agreedFee: number;
    bookingFee: number;
    extraFee?: number;
    totalAmount: number;
    propertyId: string;
    conversationId: string;
    messageId: string;
    checkInDate?: string;
    checkOutDate?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    mete?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}

interface CreatePaymentResponse {
    success: boolean;
    message: string;
    data: {
        payment: IPayment;
        clientSecret: string;
        paymentIntentId: string;
    } | null;
}

interface ConfirmPaymentRequest {
    paymentIntentId: string;
    paymentMethodId: string;
}

// ADMIN INTERFACES
interface GetAllPaymentsResponse {
    success: boolean;
    message: string;
    data: IPayment[]; // Just the payments array
    meta: {
        // Meta at root level
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface GetAllPaymentsParams {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
    propertyId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
}

interface PaymentTotalsResponse {
    success: boolean;
    message: string;
    data: {
        totalRevenue: number;
        totalCommission: number;
        totalBookingFees: number;
        totalExtraFees: number;
        totalPlatformTotal: number;
        totalHostEarnings: number;
        totalTransactions: number;
        completedTransactions: number;
    } | null;
}

interface PaymentStatsResponse {
    success: boolean;
    message: string;
    data: {
        totals: {
            payments: number;
            completed: number;
            pending: number;
            failed: number;
        };
        revenue: {
            total: number;
            platform: number;
            host: number;
        };
        monthly: Array<{
            _id: {
                year: number;
                month: number;
            };
            total: number;
            platform: number;
            host: number;
        }>;
    } | null;
}

// PDF Download Interfaces
interface DownloadPDFRequest {
    fromDate: string;
    toDate: string;
}

export const paymentApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        createPayment: builder.mutation<CreatePaymentResponse, CreatePaymentRequest>({
            query: (body) => ({
                url: "/property-payment/create",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["propertyPayments"],
        }),

        confirmPayment: builder.mutation<ApiResponse<IPayment>, ConfirmPaymentRequest>({
            query: ({ paymentIntentId, paymentMethodId }) => ({
                url: "/property-payment/confirm",
                method: "POST",
                body: { paymentIntentId, paymentMethodId },
                credentials: "include",
            }),
            invalidatesTags: ["propertyPayments", "Messages", "Conversations"],
        }),

        getMyPayments: builder.query<any, { page?: number; limit?: number }>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();
                searchParams.append("page", (params.page || 1).toString());
                searchParams.append("limit", (params.limit || 10).toString());

                return {
                    url: `/property-payment/my-payments?${searchParams.toString()}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["propertyPayments"],
        }),

        getPaymentById: builder.query<ApiResponse<IPayment>, string>({
            query: (id) => ({
                url: `/property-payment/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: (result, error, id) => [{ type: "propertyPayments", id }],
        }),
        getAllPayments: builder.query<GetAllPaymentsResponse, GetAllPaymentsParams>({
            query: (params = {}) => {
                const queryString = new URLSearchParams(
                    Object.entries({
                        page: params.page?.toString() ?? "1",
                        limit: params.limit?.toString() ?? "10",
                        ...(params.status ? { status: params.status } : {}),
                        ...(params.propertyId ? { propertyId: params.propertyId } : {}),
                        ...(params.userId ? { userId: params.userId } : {}),
                        ...(params.startDate ? { startDate: params.startDate } : {}),
                        ...(params.endDate ? { endDate: params.endDate } : {}),
                        ...(params.sortBy ? { sortBy: params.sortBy } : {}),
                        ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
                        ...(params.search ? { search: params.search } : {}),
                    })
                ).toString();

                return {
                    url: `/property-payment/admin?${queryString}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["propertyPayments"],
        }),

        getPaymentTotals: builder.query<PaymentTotalsResponse, void>({
            query: () => ({
                url: "/property-payment/admin/totals",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["propertyPayments"],
        }),

        getPaymentStatistics: builder.query<PaymentStatsResponse, void>({
            query: () => ({
                url: "/property-payment/admin/stats/statistics",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["propertyPayments"],
        }),
        getHostPayments: builder.query<any, { page?: number; limit?: number; search?: string }>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();
                searchParams.append("page", (params.page || 1).toString());
                searchParams.append("limit", (params.limit || 10).toString());

                // Add search parameter
                if (params.search) {
                    searchParams.append("search", params.search);
                }

                return {
                    url: `/property-payment/host/my-payments?${searchParams.toString()}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["propertyPayments"],
        }),
        // PDF Download Mutation
        downloadPaymentsPDF: builder.mutation<{ success: boolean }, DownloadPDFRequest>({
            async queryFn(body, _queryApi, _extraOptions, fetchWithBQ) {
                try {
                    const response = await fetchWithBQ({
                        url: "/property-payment/admin/download-pdf",
                        method: "POST",
                        body,
                        responseHandler: (r) => r.blob(),
                    });

                    if ("error" in response) {
                        return { error: response.error as any };
                    }

                    const blob = response.data as Blob;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `transactions-${body.fromDate}-to-${body.toDate}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    return { data: { success: true } };
                } catch (err: any) {
                    return { error: { message: err.message ?? "Unknown error" } };
                }
            },
        }),
        getHostSingleInvoicePDF: builder.mutation<{ success: boolean }, string>({
            async queryFn(paymentId, _queryApi, _extraOptions, fetchWithBQ) {
                try {
                    const response = await fetchWithBQ({
                        url: `/property-payment/host/my-payments/invoice/${paymentId}`,
                        method: "GET",
                        responseHandler: (r) => r.blob(),
                    });

                    if ("error" in response) {
                        return { error: response.error as any };
                    }

                    const blob = response.data as Blob;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `invoice-${paymentId}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    // Return a simple serializable object
                    return { data: { success: true } };
                } catch (err: any) {
                    return { error: { message: err.message ?? "Unknown error" } };
                }
            },
        }),
        downloadHostPaymentsPDF: builder.mutation<{ success: boolean }, { fromDate: string; toDate: string }>({
            async queryFn(body, _queryApi, _extraOptions, fetchWithBQ) {
                try {
                    const response = await fetchWithBQ({
                        url: "/property-payment/host/my-payments/payments-report",
                        method: "POST",
                        body,
                        responseHandler: (r) => r.blob(),
                    });

                    if ("error" in response) {
                        return { error: response.error as any };
                    }

                    const blob = response.data as Blob;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `payments-report-${body.fromDate}-to-${body.toDate}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    return { data: { success: true } };
                } catch (err: any) {
                    return { error: { message: err.message ?? "Unknown error" } };
                }
            },
        }),
    }),
});

export const {
    useCreatePaymentMutation,
    useConfirmPaymentMutation,
    useGetMyPaymentsQuery,
    useGetPaymentByIdQuery,
    useGetAllPaymentsQuery,
    useGetPaymentTotalsQuery,
    useGetPaymentStatisticsQuery,
    // For Host
    useGetHostPaymentsQuery,
    useGetHostSingleInvoicePDFMutation,
    useDownloadHostPaymentsPDFMutation,
    // PDF Download
    useDownloadPaymentsPDFMutation,
} = paymentApi;
