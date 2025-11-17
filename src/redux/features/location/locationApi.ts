import { baseApi } from "@/redux/api/baseApi";

export const locationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all locations
        getAllLocations: builder.query({
            query: (filters?: { search?: string; isActive?: boolean; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }) => ({
                url: "/locations",
                method: "GET",
                params: filters,
            }),
            providesTags: ["Locations"],
        }),

        // Get location by ID
        getLocationById: builder.query({
            query: (locationId: string) => ({
                url: `/locations/${locationId}`,
                method: "GET",
            }),
            providesTags: (_result, _error, locationId) => [{ type: "Locations", id: locationId }],
        }),

        // Search locations
        searchLocations: builder.query({
            query: (searchTerm: string) => ({
                url: "/locations/search",
                method: "GET",
                params: { search: searchTerm },
            }),
        }),

        // Create location
        createLocation: builder.mutation({
            query: (locationData: { name: string }) => ({
                url: "/locations",
                method: "POST",
                body: locationData,
            }),
            invalidatesTags: ["Locations"],
        }),

        // Update location
        updateLocation: builder.mutation({
            query: ({ locationId, updateData }: { locationId: string; updateData: { name?: string; isActive?: boolean } }) => ({
                url: `/locations/${locationId}`,
                method: "PATCH",
                body: updateData,
            }),
            invalidatesTags: (_result, _error, { locationId }) => ["Locations", { type: "Locations", id: locationId }],
        }),

        // Delete location
        deleteLocation: builder.mutation({
            query: (locationId: string) => ({
                url: `/locations/${locationId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Locations"],
        }),
    }),
});

export const { useGetAllLocationsQuery, useGetLocationByIdQuery, useSearchLocationsQuery, useCreateLocationMutation, useUpdateLocationMutation, useDeleteLocationMutation } = locationApi;
