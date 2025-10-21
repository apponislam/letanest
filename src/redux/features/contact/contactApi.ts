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
    }),
});

export const { useCreateContactMutation, useGetContactsQuery, useGetContactByIdQuery, useUpdateContactStatusMutation } = contactApi;
