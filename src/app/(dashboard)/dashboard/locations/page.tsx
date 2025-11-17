"use client";
import { useState } from "react";
import { useGetAllLocationsQuery, useCreateLocationMutation, useUpdateLocationMutation, useDeleteLocationMutation } from "@/redux/features/location/locationApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import Swal from "sweetalert2";

const LocationsPage = () => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        isActive: true,
    });

    const { data: locationsData, isLoading, refetch } = useGetAllLocationsQuery(filters);
    console.log(locationsData);

    const [createLocation, { isLoading: isCreating }] = useCreateLocationMutation();
    const [updateLocation, { isLoading: isUpdating }] = useUpdateLocationMutation();
    const [deleteLocation, { isLoading: isDeleting }] = useDeleteLocationMutation();

    const [newLocationName, setNewLocationName] = useState("");
    const [editingLocation, setEditingLocation] = useState<{ id: string; name: string } | null>(null);

    const locations = locationsData?.data || [];
    const meta = locationsData?.meta;

    // Calculate totalPages from meta
    const totalPages = meta?.total ? Math.ceil(meta.total / meta.limit) : 1;
    const hasNextPage = meta?.page ? meta.page < totalPages : false;
    const hasPrevPage = meta?.page ? meta.page > 1 : false;

    const handleCreateLocation = async () => {
        if (!newLocationName.trim()) {
            toast.error("Location name is required");
            return;
        }

        try {
            await createLocation({ name: newLocationName.trim() }).unwrap();
            setNewLocationName("");
            toast.success("Location created successfully");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create location");
        }
    };

    const handleUpdateLocation = async () => {
        if (!editingLocation || !editingLocation.name.trim()) {
            toast.error("Location name is required");
            return;
        }

        try {
            await updateLocation({
                locationId: editingLocation.id,
                updateData: { name: editingLocation.name.trim() },
            }).unwrap();
            setEditingLocation(null);
            toast.success("Location updated successfully");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update location");
        }
    };

    const handleDeleteLocation = async (locationId: string, locationName: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete "${locationName}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#C9A94D",
            cancelButtonColor: "#434D64",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            background: "#2D3546",
            color: "#FFFFFF",
            customClass: {
                popup: "border border-[#C9A94D] rounded-[20px]",
                title: "text-[#C9A94D]",
                htmlContainer: "text-gray-300",
                confirmButton: "bg-[#C9A94D] hover:bg-[#b8973e] text-white",
                cancelButton: "bg-[#434D64] hover:bg-[#535a6b] text-white",
            },
        });

        if (result.isConfirmed) {
            try {
                await deleteLocation(locationId).unwrap();

                // Success notification
                Swal.fire({
                    title: "Deleted!",
                    text: `"${locationName}" has been deleted successfully.`,
                    icon: "success",
                    confirmButtonColor: "#C9A94D",
                    background: "#2D3546",
                    color: "#FFFFFF",
                    customClass: {
                        popup: "border border-[#C9A94D] rounded-[20px]",
                        title: "text-[#C9A94D]",
                    },
                });

                refetch();
            } catch (error: any) {
                // Error notification
                Swal.fire({
                    title: "Error!",
                    text: error?.data?.message || "Failed to delete location",
                    icon: "error",
                    confirmButtonColor: "#C9A94D",
                    background: "#2D3546",
                    color: "#FFFFFF",
                    customClass: {
                        popup: "border border-[#C9A94D] rounded-[20px]",
                        title: "text-[#C9A94D]",
                    },
                });
            }
        }
    };

    const startEditing = (location: any) => {
        setEditingLocation({ id: location._id, name: location.name });
    };

    const cancelEditing = () => {
        setEditingLocation(null);
    };

    const handleSearch = (search: string) => {
        setFilters((prev) => ({ ...prev, search, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handlePreviousPage = () => {
        if (hasPrevPage) {
            handlePageChange(filters.page - 1);
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            handlePageChange(filters.page + 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <Loader2 className="w-8 h-8 animate-spin text-[#C9A94D]" />
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6">
            {/* Header */}
            <PageHeader title="Locations Management" />

            {/* Add New Location Card */}
            <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[20px] p-6">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-[#C9A94D]">Add New Location</h2>
                    <p className="text-gray-300">Create a new location for properties</p>
                </div>
                <div className="flex gap-4">
                    <Input placeholder="Enter location name..." value={newLocationName} onChange={(e) => setNewLocationName(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleCreateLocation()} className="flex-1 bg-[#1a2235] border-[#C9A94D] text-white placeholder:text-gray-400 focus:ring-[#C9A94D] focus:border-[#C9A94D]" />
                    <Button onClick={handleCreateLocation} disabled={isCreating || !newLocationName.trim()} className="bg-[#C9A94D] text-white hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed">
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add Location
                    </Button>
                </div>
            </div>

            {/* Locations List Card */}
            <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[20px] p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-[#C9A94D]">All Locations</h2>
                        <div className="text-white">
                            Total: <span className="text-[#C9A94D] font-bold">{meta?.total || 0}</span> location{meta?.total !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#C9A94D]" />
                        <Input type="text" placeholder="Search locations..." value={filters.search} onChange={(e) => handleSearch(e.target.value)} className="pl-10 bg-[#1a2235] border-[#C9A94D] text-white placeholder:text-gray-400 focus:ring-[#C9A94D] focus:border-[#C9A94D]" />
                    </div>
                </div>

                {/* Pagination Info */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-white text-sm">
                        Showing {locations.length} of {meta?.total || 0} locations
                    </div>
                    <div className="text-white text-sm">
                        Page {filters.page} of {totalPages}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg overflow-hidden border border-[#434D64]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#1a2235] border-b border-[#434D64] hover:bg-[#1a2235]">
                                <TableHead className="text-[#C9A94D] font-bold">Location Name</TableHead>
                                <TableHead className="text-[#C9A94D] font-bold">Status</TableHead>
                                <TableHead className="text-[#C9A94D] font-bold">Created</TableHead>
                                <TableHead className="text-[#C9A94D] font-bold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.length === 0 ? (
                                <TableRow className="border-b border-[#434D64] hover:bg-[#1a2235]">
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-300">
                                        {filters.search ? "No locations found matching your search" : "No locations created yet"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                locations.map((location: any) => (
                                    <TableRow key={location._id} className="border-b border-[#434D64] hover:bg-[#1a2235]">
                                        <TableCell className="font-medium text-white">
                                            {editingLocation?.id === location._id ? (
                                                <Input value={editingLocation?.name} onChange={(e) => setEditingLocation((prev) => (prev ? { ...prev, name: e.target.value } : null))} onKeyPress={(e) => e.key === "Enter" && handleUpdateLocation()} className="w-64 bg-[#2D3546] border-[#C9A94D] text-white focus:ring-[#C9A94D] focus:border-[#C9A94D]" />
                                            ) : (
                                                location.name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={location.isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>{location.isActive ? "Active" : "Inactive"}</Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-300">{location.createdAt ? new Date(location.createdAt).toLocaleDateString() : "-"}</TableCell>
                                        <TableCell className="text-right">
                                            {editingLocation?.id === location._id ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" onClick={handleUpdateLocation} disabled={isUpdating} className="bg-[#C9A94D] text-white hover:bg-[#b8973e]">
                                                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={cancelEditing} className="border-[#C9A94D] text-[#C9A94D] hover:bg-[#C9A94D] hover:text-white">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => startEditing(location)} className="border-[#C9A94D] text-[#C9A94D] hover:bg-[#C9A94D] hover:text-white">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteLocation(location._id, location.name)} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <Button onClick={handlePreviousPage} disabled={!hasPrevPage} className="bg-[#434D64] text-white hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        <div className="text-white text-sm">
                            Page {filters.page} of {totalPages}
                        </div>

                        <Button onClick={handleNextPage} disabled={!hasNextPage} className="bg-[#434D64] text-white hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}

                {/* Search Results Info */}
                {filters.search && locations.length > 0 && (
                    <div className="mt-4 text-sm text-gray-300">
                        Showing {locations.length} results for "{filters.search}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationsPage;
