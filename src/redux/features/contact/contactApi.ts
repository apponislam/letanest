import { baseApi } from "../../api/baseApi";

interface GetContactsParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

interface ContactsResponse {
    contacts: any[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}

interface DownloadContactsExcelParams {
    year: string;
    month?: string;
    status?: string;
}

export const contactApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create contact
        createContact: builder.mutation({
            query: (contactData) => ({
                url: "/contact",
                method: "POST",
                body: contactData,
            }),
            invalidatesTags: ["Contacts"],
        }),

        // Get all contacts with pagination
        getContacts: builder.query<ContactsResponse, GetContactsParams>({
            query: (params = {}) => ({
                url: "/contact",
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    status: params.status,
                    search: params.search,
                },
            }),
            providesTags: ["Contacts"],
            transformResponse: (response: any) => ({
                contacts: response.data,
                meta: response.meta,
            }),
        }),

        // Get contact by ID
        getContactById: builder.query({
            query: (contactId: string) => `/contact/${contactId}`,
            providesTags: (_result, _error, arg) => [{ type: "Contacts", id: arg }],
        }),

        // Update contact status
        updateContactStatus: builder.mutation({
            query: ({ contactId, status }: { contactId: string; status: string }) => ({
                url: `/contact/${contactId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Contacts", id: arg.contactId }, "Contacts"],
        }),
        // Download contacts Excel
        downloadContactsExcel: builder.mutation<{ success: boolean }, DownloadContactsExcelParams>({
            async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
                try {
                    const response = await fetchWithBQ({
                        url: "/contact/download-excel",
                        method: "GET",
                        params: {
                            year: params.year,
                            ...(params.month && params.month !== "all" && { month: params.month }),
                            ...(params.status && params.status !== "all" && { status: params.status }),
                        },
                        responseHandler: (response) => response.blob(),
                    });

                    if ("error" in response) {
                        return { error: response.error as any };
                    }

                    const blob = response.data as Blob;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;

                    const fileName = `contacts-${params.year}${params.month && params.month !== "all" ? `-${params.month.padStart(2, "0")}` : ""}${params.status && params.status !== "all" ? `-${params.status}` : ""}.xlsx`;
                    a.download = fileName;

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
        replyToContact: builder.mutation({
            query: ({ contactId, replyMessage }: { contactId: string; replyMessage: string }) => ({
                url: `/contact/${contactId}/reply`,
                method: "POST",
                body: { replyMessage },
            }),
            invalidatesTags: ["Contacts"],
        }),
    }),
});

export const { useCreateContactMutation, useGetContactsQuery, useGetContactByIdQuery, useUpdateContactStatusMutation, useDownloadContactsExcelMutation, useReplyToContactMutation } = contactApi;
