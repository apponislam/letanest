// "use client";
// import React, { useState } from "react";
// import { Search, Trash2 } from "lucide-react";
// import Image from "next/image";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import PageHeader from "@/components/PageHeader";
// import Link from "next/link";
// import { useDeleteHostPropertyMutation, useGetHostPropertiesQuery } from "@/redux/features/property/propertyApi";
// import { toast } from "sonner";

// const PropertyListing = () => {
//     const [open, setOpen] = useState(false);
//     const [propertyToDelete, setPropertyToDelete] = useState<any>(null);
//     const [activeTab, setActiveTab] = useState("all");

//     const [filters, setFilters] = useState({
//         page: 1,
//         limit: 10,
//         search: "",
//         status: "",
//     });

//     const { data, isLoading, refetch } = useGetHostPropertiesQuery(filters);
//     const [deleteProperty] = useDeleteHostPropertyMutation();

//     const properties = data?.data || [];
//     const meta = data?.meta;

//     // Filter properties based on active tab
//     const filteredProperties = properties.filter((property: any) => {
//         if (activeTab === "published") return property.status === "published";
//         if (activeTab === "unpublished") return property.status !== "published";
//         return true; // "all" tab
//     });

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case "published":
//                 return "bg-green-600";
//             case "pending":
//                 return "bg-yellow-600";
//             case "rejected":
//                 return "bg-red-600";
//             case "hidden":
//                 return "bg-purple-600";
//             default:
//                 return "bg-gray-600";
//         }
//     };

//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString();
//     };

//     const totalRevenue = meta?.totalAmount || filteredProperties.reduce((sum: number, property: any) => sum + (property.price || 0), 0);

//     // Pagination handlers
//     const handleNextPage = () => {
//         if (meta && filters.page < meta.totalPages) {
//             setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
//         }
//     };

//     const handlePrevPage = () => {
//         if (filters.page > 1) {
//             setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
//         }
//     };

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
//     };

//     const handleStatusFilter = (status: string) => {
//         setFilters((prev) => ({ ...prev, status, page: 1 }));
//     };

//     const clearFilters = () => {
//         setFilters({ page: 1, limit: 10, search: "", status: "" });
//     };

//     const handleDeleteClick = (property: any) => {
//         if (property.status === "published") {
//             toast.error("Cannot delete published properties");
//             return;
//         }
//         setPropertyToDelete(property);
//         setOpen(true);
//     };

//     const handleConfirmDelete = async () => {
//         if (!propertyToDelete) return;

//         try {
//             await deleteProperty(propertyToDelete._id).unwrap();
//             toast.success("Property deleted successfully");
//             setOpen(false);
//             setPropertyToDelete(null);
//             refetch();
//         } catch (error: any) {
//             toast.error(error?.data?.message || "Failed to delete property");
//         }
//     };

//     const handleTabChange = (value: string) => {
//         setActiveTab(value);
//         setFilters({ page: 1, limit: 10, search: "", status: "" });
//     };

//     const canDeleteProperty = (property: any) => {
//         return property.status !== "published";
//     };

//     return (
//         <div className="container mx-auto">
//             <PageHeader title={"My Properties"}></PageHeader>

//             <Link href={"/dashboard/listing/add"}>
//                 <button className="py-3 px-4 md:px-10 mb-6 bg-[#C9A94D] text-white flex gap-2 md:gap-3 items-center rounded-[10px]">
//                     <Image src="/listing/add/plus-square.png" alt="Plus Icon" width={24} height={24} />
//                     Add New Property
//                 </button>
//             </Link>

//             <div className="w-full">
//                 <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
//                     {/* Tab Triggers */}
//                     <TabsList className="flex h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-6 w-full flex-col md:flex-row">
//                         <TabsTrigger value="all" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
//                             All Properties
//                         </TabsTrigger>
//                         <TabsTrigger value="published" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
//                             Published
//                         </TabsTrigger>
//                         <TabsTrigger value="unpublished" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
//                             Unpublished
//                         </TabsTrigger>
//                     </TabsList>

//                     {/* All Properties Tab */}
//                     <TabsContent value="all">
//                         <PropertyList
//                             properties={filteredProperties}
//                             isLoading={isLoading}
//                             filters={filters}
//                             meta={meta}
//                             title="All Properties"
//                             onSearch={handleSearch}
//                             onStatusFilter={handleStatusFilter}
//                             onClearFilters={clearFilters}
//                             onPrevPage={handlePrevPage}
//                             onNextPage={handleNextPage}
//                             onDeleteClick={handleDeleteClick}
//                             canDeleteProperty={canDeleteProperty}
//                             showStatusFilter={true}
//                             getStatusColor={getStatusColor}
//                             formatDate={formatDate}
//                         />
//                     </TabsContent>

//                     {/* Published Properties Tab */}
//                     <TabsContent value="published">
//                         <PropertyList
//                             properties={filteredProperties}
//                             isLoading={isLoading}
//                             filters={filters}
//                             meta={meta}
//                             title="Published Properties"
//                             onSearch={handleSearch}
//                             onStatusFilter={handleStatusFilter}
//                             onClearFilters={clearFilters}
//                             onPrevPage={handlePrevPage}
//                             onNextPage={handleNextPage}
//                             onDeleteClick={handleDeleteClick}
//                             canDeleteProperty={canDeleteProperty}
//                             showStatusFilter={false}
//                             getStatusColor={getStatusColor}
//                             formatDate={formatDate}
//                         />
//                     </TabsContent>

//                     {/* Unpublished Properties Tab */}
//                     <TabsContent value="unpublished">
//                         <PropertyList
//                             properties={filteredProperties}
//                             isLoading={isLoading}
//                             filters={filters}
//                             meta={meta}
//                             title="Unpublished Properties"
//                             onSearch={handleSearch}
//                             onStatusFilter={handleStatusFilter}
//                             onClearFilters={clearFilters}
//                             onPrevPage={handlePrevPage}
//                             onNextPage={handleNextPage}
//                             onDeleteClick={handleDeleteClick}
//                             canDeleteProperty={canDeleteProperty}
//                             showStatusFilter={true}
//                             getStatusColor={getStatusColor}
//                             formatDate={formatDate}
//                         />
//                     </TabsContent>
//                 </Tabs>
//             </div>

//             {/* Delete Confirmation Modal */}
//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[320px]">
//                     <style jsx global>{`
//                         [data-slot="dialog-close"] {
//                             color: white !important;
//                             opacity: 1 !important;
//                         }
//                         [data-slot="dialog-close"]:hover {
//                             color: #c9a94d !important;
//                         }
//                         [data-slot="dialog-close"] svg {
//                             stroke: currentColor;
//                         }
//                     `}</style>
//                     <DialogHeader>
//                         <DialogTitle className="text-white text-center">Confirm Delete</DialogTitle>
//                     </DialogHeader>
//                     <div className="text-center text-white">
//                         <p>Are you sure you want to delete this property?</p>
//                         <p className="font-semibold mt-2">{propertyToDelete?.title}</p>
//                         <p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p>
//                     </div>
//                     <DialogFooter className="flex gap-2 justify-center">
//                         <button onClick={() => setOpen(false)} className="px-6 py-2 bg-gray-600 text-white rounded-[8px] hover:bg-gray-700 transition">
//                             Cancel
//                         </button>
//                         <button onClick={handleConfirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
//                             Delete
//                         </button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// // Property List Component to avoid code duplication
// const PropertyList = ({ properties, isLoading, filters, meta, title, onSearch, onStatusFilter, onClearFilters, onPrevPage, onNextPage, onDeleteClick, canDeleteProperty, showStatusFilter, getStatusColor, formatDate }: any) => {
//     const totalRevenue = properties.reduce((sum: number, property: any) => sum + (property.price || 0), 0);

//     return (
//         <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
//             <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
//                 <span className="font-semibold text-[28px]">{title}</span>
//                 <div className="text-right w-full md:w-auto">
//                     <span className="block">Total Value: £{totalRevenue}</span>
//                     <span className="text-sm text-gray-400">
//                         Showing {properties.length} of {meta?.total} properties
//                     </span>
//                 </div>
//             </div>

//             {/* Search and Filters */}
//             <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
//                 <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                     {/* Search */}
//                     <div className="relative flex-1 w-full">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input type="text" placeholder="Search properties..." value={filters.search} onChange={onSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                     </div>

//                     {/* Status Filter - Only show for tabs that need it */}
//                     {showStatusFilter && (
//                         <div className="flex gap-2 flex-wrap">
//                             <select value={filters.status} onChange={(e) => onStatusFilter(e.target.value)} className="px-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white focus:outline-none focus:ring-2 focus:ring-[#C9A94D]">
//                                 <option value="">All Status</option>
//                                 <option value="pending">Pending</option>
//                                 <option value="rejected">Rejected</option>
//                                 <option value="hidden">Hidden</option>
//                             </select>

//                             {(filters.search || filters.status) && (
//                                 <button onClick={onClearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
//                                     Clear
//                                 </button>
//                             )}
//                         </div>
//                     )}

//                     {/* Only search clear button for published tab */}
//                     {!showStatusFilter && filters.search && (
//                         <button onClick={onClearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
//                             Clear
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {isLoading ? (
//                 <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
//                     <p className="mt-4">Loading properties...</p>
//                 </div>
//             ) : properties.length === 0 ? (
//                 <div className="text-center py-8">
//                     <p className="text-lg">No properties found</p>
//                     {(filters.search || filters.status) && (
//                         <button onClick={onClearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
//                             Clear filters
//                         </button>
//                     )}
//                 </div>
//             ) : (
//                 <>
//                     <div className="space-y-3">
//                         {properties.map((property: any) => (
//                             <div key={property._id} className="p-4 rounded-[12px] flex justify-between items-center border border-[#C9A94D] flex-col md:flex-row">
//                                 <div className="flex items-center gap-4 flex-1 flex-col md:flex-row w-full md:w-auto">
//                                     <div className="relative w-28 h-20 flex-shrink-0">
//                                         <Image
//                                             src={`${process.env.NEXT_PUBLIC_BASE_API}${property.coverPhoto}`}
//                                             alt={property.title}
//                                             fill
//                                             className="object-cover rounded-lg"
//                                             onError={(e) => {
//                                                 (e.target as HTMLImageElement).src = "/listing/bedroompic.png";
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="flex-1 w-full">
//                                         <div className="flex items-start justify-between flex-col md:flex-row w-full md:w-auto gap-2">
//                                             <div>
//                                                 <p className="font-semibold text-white text-lg">{property.title}</p>
//                                                 <p className="text-sm text-gray-300">
//                                                     {property.location} • {property.propertyType}
//                                                 </p>
//                                                 <p className="text-sm mt-1">
//                                                     {formatDate(property.availableFrom)} - {formatDate(property.availableTo)}
//                                                 </p>
//                                                 <p className="text-white font-medium mt-1">
//                                                     {property.maxGuests} Guest{property.maxGuests !== 1 ? "s" : ""} · £{property.price}
//                                                 </p>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(property.status)}`}>{property.status}</span>
//                                                 <span className="text-xs bg-[#2D3546] px-2 py-1 rounded">#{property.propertyNumber}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Action Buttons */}
//                                 <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
//                                     {canDeleteProperty(property) ? (
//                                         <button onClick={() => onDeleteClick(property)} className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition md:ml-4 flex items-center gap-2 text-white">
//                                             <Trash2 className="w-5 h-5" />
//                                             <span className="hidden md:inline">Delete</span>
//                                         </button>
//                                     ) : (
//                                         <button disabled className="p-2 rounded-full bg-gray-600 cursor-not-allowed transition md:ml-4 flex items-center gap-2 text-gray-400" title="Cannot delete published properties">
//                                             <Trash2 className="w-5 h-5" />
//                                             <span className="hidden md:inline">Delete</span>
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Pagination */}
//                     {meta && meta.totalPages > 1 && (
//                         <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
//                             <button onClick={onPrevPage} disabled={filters.page === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                 Previous
//                             </button>

//                             <div className="text-white text-sm">
//                                 Page {filters.page} of {meta.totalPages}
//                                 <span className="text-gray-400 ml-2">({meta.total} total properties)</span>
//                             </div>

//                             <button onClick={onNextPage} disabled={filters.page >= meta.totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default PropertyListing;

"use client";
import React, { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useDeleteHostPropertyMutation, useGetHostPropertiesQuery } from "@/redux/features/property/propertyApi";
import { toast } from "sonner";

const PropertyListing = () => {
    const [open, setOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("all");

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        status: "",
    });

    const { data, isLoading, refetch } = useGetHostPropertiesQuery(filters);
    const [deleteProperty] = useDeleteHostPropertyMutation();

    const properties = data?.data || [];
    const meta = data?.meta;

    // Filter properties based on active tab
    const filteredProperties = properties.filter((property: any) => {
        if (activeTab === "published") return property.status === "published";
        if (activeTab === "pending") return property.status === "pending"; // Changed to only show pending
        return true; // "all" tab
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-600";
            case "pending":
                return "bg-yellow-600";
            case "rejected":
                return "bg-red-600";
            case "hidden":
                return "bg-purple-600";
            default:
                return "bg-gray-600";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const totalRevenue = meta?.totalAmount || filteredProperties.reduce((sum: number, property: any) => sum + (property.price || 0), 0);

    // Pagination handlers
    const handleNextPage = () => {
        if (meta && filters.page < meta.totalPages) {
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrevPage = () => {
        if (filters.page > 1) {
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleStatusFilter = (status: string) => {
        setFilters((prev) => ({ ...prev, status, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ page: 1, limit: 10, search: "", status: "" });
    };

    const handleDeleteClick = (property: any) => {
        if (property.status === "published") {
            toast.error("Cannot delete published properties");
            return;
        }
        setPropertyToDelete(property);
        setOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!propertyToDelete) return;

        try {
            await deleteProperty(propertyToDelete._id).unwrap();
            toast.success("Property deleted successfully");
            setOpen(false);
            setPropertyToDelete(null);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete property");
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setFilters({ page: 1, limit: 10, search: "", status: "" });
    };

    const canDeleteProperty = (property: any) => {
        return property.status !== "published";
    };

    return (
        <div className="container mx-auto">
            <PageHeader title={"My Properties"}></PageHeader>

            <Link href={"/dashboard/listing/add"}>
                <button className="py-3 px-4 md:px-10 mb-6 bg-[#C9A94D] text-white flex gap-2 md:gap-3 items-center rounded-[10px]">
                    <Image src="/listing/add/plus-square.png" alt="Plus Icon" width={24} height={24} />
                    Add New Property
                </button>
            </Link>

            <div className="w-full">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    {/* Tab Triggers */}
                    <TabsList className="flex h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-6 w-full flex-col md:flex-row">
                        <TabsTrigger value="all" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
                            All Properties
                        </TabsTrigger>
                        <TabsTrigger value="published" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                            Published
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="p-3 h-auto rounded-[10px] w-full md:w-1/3 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                            Pending Properties
                        </TabsTrigger>
                    </TabsList>

                    {/* All Properties Tab */}
                    <TabsContent value="all">
                        <PropertyList
                            properties={filteredProperties}
                            isLoading={isLoading}
                            filters={filters}
                            meta={meta}
                            title="All Properties"
                            onSearch={handleSearch}
                            onStatusFilter={handleStatusFilter}
                            onClearFilters={clearFilters}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                            onDeleteClick={handleDeleteClick}
                            canDeleteProperty={canDeleteProperty}
                            showStatusFilter={true}
                            getStatusColor={getStatusColor}
                            formatDate={formatDate}
                        />
                    </TabsContent>

                    {/* Published Properties Tab */}
                    <TabsContent value="published">
                        <PropertyList
                            properties={filteredProperties}
                            isLoading={isLoading}
                            filters={filters}
                            meta={meta}
                            title="Published Properties"
                            onSearch={handleSearch}
                            onStatusFilter={handleStatusFilter}
                            onClearFilters={clearFilters}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                            onDeleteClick={handleDeleteClick}
                            canDeleteProperty={canDeleteProperty}
                            showStatusFilter={false}
                            getStatusColor={getStatusColor}
                            formatDate={formatDate}
                        />
                    </TabsContent>

                    {/* Pending Properties Tab */}
                    <TabsContent value="pending">
                        <PropertyList
                            properties={filteredProperties}
                            isLoading={isLoading}
                            filters={filters}
                            meta={meta}
                            title="Pending Properties"
                            onSearch={handleSearch}
                            onStatusFilter={handleStatusFilter}
                            onClearFilters={clearFilters}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                            onDeleteClick={handleDeleteClick}
                            canDeleteProperty={canDeleteProperty}
                            showStatusFilter={false}
                            getStatusColor={getStatusColor}
                            formatDate={formatDate}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[320px]">
                    <style jsx global>{`
                        [data-slot="dialog-close"] {
                            color: white !important;
                            opacity: 1 !important;
                        }
                        [data-slot="dialog-close"]:hover {
                            color: #c9a94d !important;
                        }
                        [data-slot="dialog-close"] svg {
                            stroke: currentColor;
                        }
                    `}</style>
                    <DialogHeader>
                        <DialogTitle className="text-white text-center">Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="text-center text-white">
                        <p>Are you sure you want to delete this property?</p>
                        <p className="font-semibold mt-2">{propertyToDelete?.title}</p>
                        <p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p>
                    </div>
                    <DialogFooter className="flex gap-2 justify-center">
                        <button onClick={() => setOpen(false)} className="px-6 py-2 bg-gray-600 text-white rounded-[8px] hover:bg-gray-700 transition">
                            Cancel
                        </button>
                        <button onClick={handleConfirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
                            Delete
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Property List Component to avoid code duplication
const PropertyList = ({ properties, isLoading, filters, meta, title, onSearch, onStatusFilter, onClearFilters, onPrevPage, onNextPage, onDeleteClick, canDeleteProperty, showStatusFilter, getStatusColor, formatDate }: any) => {
    const totalRevenue = properties.reduce((sum: number, property: any) => sum + (property.price || 0), 0);

    return (
        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
            <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
                <span className="font-semibold text-[28px]">{title}</span>
                <div className="text-right w-full md:w-auto">
                    <span className="block">Total Value: £{totalRevenue}</span>
                    <span className="text-sm text-gray-400">
                        Showing {properties.length} of {meta?.total} properties
                    </span>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="text" placeholder="Search properties..." value={filters.search} onChange={onSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                    </div>

                    {/* Status Filter - Only show for tabs that need it */}
                    {showStatusFilter && (
                        <div className="flex gap-2 flex-wrap">
                            <select value={filters.status} onChange={(e) => onStatusFilter(e.target.value)} className="px-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white focus:outline-none focus:ring-2 focus:ring-[#C9A94D]">
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                                <option value="hidden">Hidden</option>
                            </select>

                            {(filters.search || filters.status) && (
                                <button onClick={onClearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
                                    Clear
                                </button>
                            )}
                        </div>
                    )}

                    {/* Only search clear button for tabs without status filter */}
                    {!showStatusFilter && filters.search && (
                        <button onClick={onClearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                    <p className="mt-4">Loading properties...</p>
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-lg">No properties found</p>
                    {(filters.search || (showStatusFilter && filters.status)) && (
                        <button onClick={onClearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {properties.map((property: any) => (
                            <div key={property._id} className="p-4 rounded-[12px] flex justify-between items-center border border-[#C9A94D] flex-col md:flex-row">
                                <div className="flex items-center gap-4 flex-1 flex-col md:flex-row w-full md:w-auto">
                                    <div className="relative w-28 h-20 flex-shrink-0">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_API}${property.coverPhoto}`}
                                            alt={property.title}
                                            fill
                                            className="object-cover rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/listing/bedroompic.png";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex items-start justify-between flex-col md:flex-row w-full md:w-auto gap-2">
                                            <div>
                                                <p className="font-semibold text-white text-lg">{property.title}</p>
                                                <p className="text-sm text-gray-300">
                                                    {property.location} • {property.propertyType}
                                                </p>
                                                <p className="text-sm mt-1">
                                                    {formatDate(property.availableFrom)} - {formatDate(property.availableTo)}
                                                </p>
                                                <p className="text-white font-medium mt-1">
                                                    {property.maxGuests} Guest{property.maxGuests !== 1 ? "s" : ""} · £{property.price}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(property.status)}`}>{property.status}</span>
                                                <span className="text-xs bg-[#2D3546] px-2 py-1 rounded">#{property.propertyNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
                                    {canDeleteProperty(property) ? (
                                        <button onClick={() => onDeleteClick(property)} className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition md:ml-4 flex items-center gap-2 text-white">
                                            <Trash2 className="w-5 h-5" />
                                            <span className="hidden md:inline">Delete</span>
                                        </button>
                                    ) : (
                                        <button disabled className="p-2 rounded-full bg-gray-600 cursor-not-allowed transition md:ml-4 flex items-center gap-2 text-gray-400" title="Cannot delete published properties">
                                            <Trash2 className="w-5 h-5" />
                                            <span className="hidden md:inline">Delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
                            <button onClick={onPrevPage} disabled={filters.page === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                Previous
                            </button>

                            <div className="text-white text-sm">
                                Page {filters.page} of {meta.totalPages}
                                <span className="text-gray-400 ml-2">({meta.total} total properties)</span>
                            </div>

                            <button onClick={onNextPage} disabled={filters.page >= meta.totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PropertyListing;
