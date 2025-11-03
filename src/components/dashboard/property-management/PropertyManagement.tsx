// "use client";
// import React, { useState } from "react";
// import { Star, Search } from "lucide-react";
// import Image from "next/image";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { EllipsisVertical } from "lucide-react";
// import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
// import PageHeader from "@/components/PageHeader";
// import Link from "next/link";
// import { useChangePropertyStatusMutation, useGetAllPropertiesForAdminQuery, useGetPublishedPropertiesForAdminQuery, useTogglePropertyFeaturedMutation, useTogglePropertyTrendingMutation } from "@/redux/features/property/propertyApi";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { useCreateConversationMutation } from "@/redux/features/messages/messageApi";

// const PropertyManagement = () => {
//     const [open, setOpen] = useState(false);
//     const [selectedHost, setSelectedHost] = useState<any>(null);
//     const [activeTab, setActiveTab] = useState("non-published");
//     const router = useRouter();
//     const [createConversation] = useCreateConversationMutation();

//     // Add the toggle mutations
//     const [toggleFeatured] = useTogglePropertyFeaturedMutation();
//     const [toggleTrending] = useTogglePropertyTrendingMutation();

//     const createConversion = async (hostId: string) => {
//         try {
//             await createConversation({
//                 participants: [hostId!],
//             }).unwrap();
//         } catch (error) {
//             console.log("Error creating conversation:", error);
//         }
//     };

//     const [filters, setFilters] = useState({
//         page: 1,
//         limit: 10,
//         search: "",
//         status: "",
//     });

//     // Use different queries based on active tab with type parameter
//     const { data: nonPublishedData, isLoading: nonPublishedLoading } = useGetAllPropertiesForAdminQuery(activeTab === "non-published" ? filters : undefined);

//     const { data: publishedData, isLoading: publishedLoading } = useGetPublishedPropertiesForAdminQuery(activeTab === "published" ? { ...filters, type: undefined } : undefined);

//     const { data: featuredData, isLoading: featuredLoading } = useGetPublishedPropertiesForAdminQuery(activeTab === "featured" ? { ...filters, type: "featured" } : undefined);

//     const { data: trendingData, isLoading: trendingLoading } = useGetPublishedPropertiesForAdminQuery(activeTab === "trending" ? { ...filters, type: "trending" } : undefined);

//     // Select data based on active tab
//     const getDataByTab = () => {
//         switch (activeTab) {
//             case "non-published":
//                 return nonPublishedData;
//             case "published":
//                 return publishedData;
//             case "featured":
//                 return featuredData;
//             case "trending":
//                 return trendingData;
//             default:
//                 return nonPublishedData;
//         }
//     };

//     const getLoadingByTab = () => {
//         switch (activeTab) {
//             case "non-published":
//                 return nonPublishedLoading;
//             case "published":
//                 return publishedLoading;
//             case "featured":
//                 return featuredLoading;
//             case "trending":
//                 return trendingLoading;
//             default:
//                 return nonPublishedLoading;
//         }
//     };

//     const data = getDataByTab();
//     const isLoading = getLoadingByTab();
//     const properties = data?.data || [];
//     const meta = data?.meta;

//     const handleHostDetails = (host: any) => {
//         setSelectedHost(host);
//         setOpen(true);
//     };

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

//     const totalRevenue = meta?.totalAmount || properties.reduce((sum: number, property: any) => sum + (property.price || 0), 0);

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

//     const [changeStatus] = useChangePropertyStatusMutation();

//     const handlePropertyStatusChange = async (propertyId: string, newStatus: string) => {
//         try {
//             await changeStatus({ id: propertyId, status: newStatus }).unwrap();
//             toast.success("Status updated successfully");
//         } catch (error) {
//             toast.error("Failed to update status");
//         }
//     };

//     // Updated toggle handlers using the mutations
//     const handleToggleFeatured = async (propertyId: string) => {
//         try {
//             await toggleFeatured(propertyId).unwrap();
//             toast.success("Featured status updated");
//         } catch (error) {
//             toast.error("Failed to update featured status");
//         }
//     };

//     const handleToggleTrending = async (propertyId: string) => {
//         try {
//             await toggleTrending(propertyId).unwrap();
//             toast.success("Trending status updated");
//         } catch (error) {
//             toast.error("Failed to update trending status");
//         }
//     };

//     const handleTabChange = (value: string) => {
//         setActiveTab(value);
//         setFilters({ page: 1, limit: 10, search: "", status: "" });
//     };

//     return (
//         <div className="container mx-auto">
//             <PageHeader title={"Property Management"}></PageHeader>

//             <div className="flex items-center mb-6">
//                 <Link href={"/dashboard/listing/add"} className="w-auto cursor-pointer">
//                     <button className="py-3 px-4 md:px-10 bg-[#C9A94D] text-white flex gap-2 md:gap-3 items-center rounded-[10px] cursor-pointer">
//                         <Image src="/listing/add/plus-square.png" alt="Plus Icon" width={24} height={24} />
//                         Add Properties Manually
//                     </button>
//                 </Link>
//             </div>

//             <div className="w-full">
//                 <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
//                     {/* Tab Triggers */}
//                     <TabsList className="flex h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-6 w-full flex-col md:flex-row">
//                         <TabsTrigger value="non-published" className="p-3 h-auto rounded-[10px] w-full md:w-1/4 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
//                             Property Management
//                         </TabsTrigger>
//                         <TabsTrigger value="published" className="p-3 h-auto rounded-[10px] w-full md:w-1/4 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
//                             Published Properties
//                         </TabsTrigger>
//                         <TabsTrigger value="featured" className="p-3 h-auto rounded-[10px] w-full md:w-1/4 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
//                             Featured Properties
//                         </TabsTrigger>
//                         <TabsTrigger value="trending" className="p-3 h-auto rounded-[10px] w-full md:w-1/4 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
//                             Trending Properties
//                         </TabsTrigger>
//                     </TabsList>

//                     {/* Non-Published Properties Tab */}
//                     <TabsContent value="non-published">
//                         <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
//                             <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
//                                 <span className="font-semibold text-[28px]">Property Management</span>
//                                 <div className="text-right w-full md:w-auto">
//                                     <span className="block">Total: £{totalRevenue}</span>
//                                     <span className="text-sm text-gray-400">
//                                         Showing {properties.length} of {meta?.total} properties
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Search and Filters */}
//                             <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
//                                 <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                                     {/* Search */}
//                                     <div className="relative flex-1 w-full">
//                                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                         <input type="text" placeholder="Search properties..." value={filters.search} onChange={handleSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                                     </div>

//                                     {/* Status Filter */}
//                                     <div className="flex gap-2 flex-wrap">
//                                         <select value={filters.status} onChange={(e) => handleStatusFilter(e.target.value)} className="px-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white focus:outline-none focus:ring-2 focus:ring-[#C9A94D]">
//                                             <option value="">All Status</option>
//                                             <option value="pending">Pending</option>
//                                             <option value="rejected">Rejected</option>
//                                             <option value="hidden">Hidden</option>
//                                         </select>

//                                         {(filters.search || filters.status) && (
//                                             <button onClick={clearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
//                                                 Clear
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {isLoading ? (
//                                 <div className="text-center py-8">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
//                                     <p className="mt-4">Loading properties...</p>
//                                 </div>
//                             ) : properties.length === 0 ? (
//                                 <div className="text-center py-8">
//                                     <p className="text-lg">No properties found</p>
//                                     {filters.search || filters.status ? (
//                                         <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
//                                             Clear filters
//                                         </button>
//                                     ) : null}
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="space-y-3">
//                                         {properties.map((property: any) => (
//                                             <div key={property._id} className="p-4 rounded-[12px] flex justify-between items-center border border-[#C9A94D] flex-col md:flex-row">
//                                                 <div className="flex items-center gap-4 flex-1 flex-col md:flex-row w-full md:w-auto">
//                                                     <div className="relative w-28 h-20 flex-shrink-0">
//                                                         <Image
//                                                             src={`${process.env.NEXT_PUBLIC_BASE_API}${property.coverPhoto}`}
//                                                             alt={property.title}
//                                                             fill
//                                                             className="object-cover rounded-lg"
//                                                             onError={(e) => {
//                                                                 (e.target as HTMLImageElement).src = "/listing/bedroompic.png";
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     <div className="flex-1 w-full">
//                                                         <div className="flex items-start justify-between flex-col md:flex-row w-full md:w-auto gap-2">
//                                                             <div>
//                                                                 <p className="font-semibold text-white text-lg">{property.title}</p>
//                                                                 <p className="text-sm text-gray-300">
//                                                                     {property.location} • {property.propertyType}
//                                                                 </p>
//                                                                 <p className="text-sm mt-1">
//                                                                     {formatDate(property.availableFrom)} - {formatDate(property.availableTo)}
//                                                                 </p>
//                                                                 <p className="text-white font-medium mt-1">
//                                                                     {property.maxGuests} Guest{property.maxGuests !== 1 ? "s" : ""} · £{property.price}
//                                                                 </p>
//                                                             </div>
//                                                             <div className="flex items-center gap-2">
//                                                                 <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(property.status)}`}>{property.status}</span>
//                                                                 <span className="text-xs bg-[#2D3546] px-2 py-1 rounded">#{property.propertyNumber}</span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <DropdownMenu>
//                                                     <DropdownMenuTrigger asChild>
//                                                         <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
//                                                             <button className="p-2 rounded-full bg-[#3a4459] hover:bg-[#3a4459] transition md:ml-4 flex flex-end">
//                                                                 <EllipsisVertical className="w-5 h-5 text-white" />
//                                                             </button>
//                                                         </div>
//                                                     </DropdownMenuTrigger>

//                                                     <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
//                                                         <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "published")}>
//                                                             <span className="w-full text-center">Publish</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#b30000] focus:bg-[#b30000] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "rejected")}>
//                                                             <span className="w-full text-center">Reject</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "hidden")}>
//                                                             <span className="w-full text-center">Hide</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem
//                                                             className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white"
//                                                             onSelect={(event) => {
//                                                                 event.preventDefault();
//                                                                 handleHostDetails(property.createdBy);
//                                                             }}
//                                                         >
//                                                             <span className="w-full text-center">Host Details</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onClick={() => router.push(`/dashboard/property-management/edit/${property._id}`)}>
//                                                             <span className="w-full text-center">Edit Property</span>
//                                                         </DropdownMenuItem>
//                                                     </DropdownMenuContent>
//                                                 </DropdownMenu>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Pagination */}
//                                     {meta && meta.totalPages > 1 && (
//                                         <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
//                                             <button onClick={handlePrevPage} disabled={filters.page === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                                 Previous
//                                             </button>

//                                             <div className="text-white text-sm">
//                                                 Page {filters.page} of {meta.totalPages}
//                                                 <span className="text-gray-400 ml-2">({meta.total} total properties)</span>
//                                             </div>

//                                             <button onClick={handleNextPage} disabled={filters.page >= meta.totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                                 Next
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </TabsContent>

//                     {/* Published Properties Tab */}
//                     <TabsContent value="published">
//                         <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
//                             <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
//                                 <span className="font-semibold text-[28px]">Published Properties</span>
//                                 <div className="text-right w-full md:w-auto">
//                                     <span className="block">Total: £{totalRevenue}</span>
//                                     <span className="text-sm text-gray-400">
//                                         Showing {properties.length} of {meta?.total} properties
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Search and Filters - Only search for published tab */}
//                             <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
//                                 <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                                     {/* Search */}
//                                     <div className="relative flex-1 w-full">
//                                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                         <input type="text" placeholder="Search published properties..." value={filters.search} onChange={handleSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                                     </div>

//                                     {/* Clear filter button */}
//                                     {filters.search && (
//                                         <button onClick={clearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
//                                             Clear
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>

//                             {isLoading ? (
//                                 <div className="text-center py-8">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
//                                     <p className="mt-4">Loading published properties...</p>
//                                 </div>
//                             ) : properties.length === 0 ? (
//                                 <div className="text-center py-8">
//                                     <p className="text-lg">No published properties found</p>
//                                     {filters.search ? (
//                                         <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
//                                             Clear search
//                                         </button>
//                                     ) : null}
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="space-y-3">
//                                         {properties.map((property: any) => (
//                                             <div key={property._id} className="p-4 rounded-[12px] flex justify-between items-center border border-[#C9A94D] flex-col md:flex-row">
//                                                 <div className="flex items-center gap-4 flex-1 flex-col md:flex-row w-full md:w-auto">
//                                                     <div className="relative w-28 h-20 flex-shrink-0">
//                                                         <Image
//                                                             src={`${process.env.NEXT_PUBLIC_BASE_API}${property.coverPhoto}`}
//                                                             alt={property.title}
//                                                             fill
//                                                             className="object-cover rounded-lg"
//                                                             onError={(e) => {
//                                                                 (e.target as HTMLImageElement).src = "/listing/bedroompic.png";
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     <div className="flex-1 w-full">
//                                                         <div className="flex items-start justify-between flex-col md:flex-row w-full md:w-auto gap-2">
//                                                             <div>
//                                                                 <p className="font-semibold text-white text-lg">{property.title}</p>
//                                                                 <p className="text-sm text-gray-300">
//                                                                     {property.location} • {property.propertyType}
//                                                                 </p>
//                                                                 <p className="text-sm mt-1">
//                                                                     {formatDate(property.availableFrom)} - {formatDate(property.availableTo)}
//                                                                 </p>
//                                                                 <p className="text-white font-medium mt-1">
//                                                                     {property.maxGuests} Guest{property.maxGuests !== 1 ? "s" : ""} · £{property.price}
//                                                                 </p>
//                                                             </div>
//                                                             <div className="flex items-center gap-2">
//                                                                 <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(property.status)}`}>{property.status}</span>
//                                                                 <span className="text-xs bg-[#2D3546] px-2 py-1 rounded">#{property.propertyNumber}</span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <DropdownMenu>
//                                                     <DropdownMenuTrigger asChild>
//                                                         <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
//                                                             <button className="p-2 rounded-full bg-[#3a4459] hover:bg-[#3a4459] transition md:ml-4 flex flex-end">
//                                                                 <EllipsisVertical className="w-5 h-5 text-white" />
//                                                             </button>
//                                                         </div>
//                                                     </DropdownMenuTrigger>

//                                                     <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
//                                                         {/* Toggle Featured Button */}
//                                                         <DropdownMenuItem className={`${property.featured ? "bg-[#FF6B35]" : "bg-[#FFA500]"} text-white hover:opacity-90 justify-center rounded-[20px] cursor-pointer`} onSelect={() => handleToggleFeatured(property._id)}>
//                                                             <span className="w-full text-center">{property.featured ? "Remove Featured" : "Set as Featured"}</span>
//                                                         </DropdownMenuItem>

//                                                         {/* Toggle Trending Button */}
//                                                         <DropdownMenuItem className={`${property.trending ? "bg-[#FF8C00]" : "bg-[#FFA500]"} text-white hover:opacity-90 justify-center rounded-[20px] cursor-pointer`} onSelect={() => handleToggleTrending(property._id)}>
//                                                             <span className="w-full text-center">{property.trending ? "Remove Trending" : "Set as Trending"}</span>
//                                                         </DropdownMenuItem>

//                                                         <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#b30000] focus:bg-[#b30000] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "rejected")}>
//                                                             <span className="w-full text-center">Reject</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "hidden")}>
//                                                             <span className="w-full text-center">Hide</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "pending")}>
//                                                             <span className="w-full text-center">Set to Pending</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem
//                                                             className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white"
//                                                             onSelect={(event) => {
//                                                                 event.preventDefault();
//                                                                 handleHostDetails(property.createdBy);
//                                                             }}
//                                                         >
//                                                             <span className="w-full text-center">Host Details</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onClick={() => router.push(`/dashboard/property-management/edit/${property._id}`)}>
//                                                             <span className="w-full text-center">Edit Property</span>
//                                                         </DropdownMenuItem>
//                                                     </DropdownMenuContent>
//                                                 </DropdownMenu>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Pagination */}
//                                     {meta && meta.totalPages > 1 && (
//                                         <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
//                                             <button onClick={handlePrevPage} disabled={filters.page === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                                 Previous
//                                             </button>

//                                             <div className="text-white text-sm">
//                                                 Page {filters.page} of {meta.totalPages}
//                                                 <span className="text-gray-400 ml-2">({meta.total} total properties)</span>
//                                             </div>

//                                             <button onClick={handleNextPage} disabled={filters.page >= meta.totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                                 Next
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </TabsContent>

//                     {/* Featured Properties Tab */}
//                     <TabsContent value="featured">
//                         <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
//                             <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
//                                 <span className="font-semibold text-[28px]">Featured Properties</span>
//                                 <div className="text-right w-full md:w-auto">
//                                     <span className="block">Total: £{totalRevenue}</span>
//                                     <span className="text-sm text-gray-400">
//                                         Showing {properties.length} of {meta?.total} properties
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Search for Featured Properties */}
//                             <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
//                                 <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                                     <div className="relative flex-1 w-full">
//                                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                         <input type="text" placeholder="Search featured properties..." value={filters.search} onChange={handleSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                                     </div>

//                                     {filters.search && (
//                                         <button onClick={clearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
//                                             Clear
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>

//                             {isLoading ? (
//                                 <div className="text-center py-8">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
//                                     <p className="mt-4">Loading featured properties...</p>
//                                 </div>
//                             ) : properties.length === 0 ? (
//                                 <div className="text-center py-8">
//                                     <p className="text-lg">No featured properties found</p>
//                                     {filters.search ? (
//                                         <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
//                                             Clear search
//                                         </button>
//                                     ) : null}
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="space-y-3">
//                                         {properties.map((property: any) => (
//                                             <div key={property._id} className="p-4 rounded-[12px] flex justify-between items-center border border-[#C9A94D] flex-col md:flex-row">
//                                                 <div className="flex items-center gap-4 flex-1 flex-col md:flex-row w-full md:w-auto">
//                                                     <div className="relative w-28 h-20 flex-shrink-0">
//                                                         <Image
//                                                             src={`${process.env.NEXT_PUBLIC_BASE_API}${property.coverPhoto}`}
//                                                             alt={property.title}
//                                                             fill
//                                                             className="object-cover rounded-lg"
//                                                             onError={(e) => {
//                                                                 (e.target as HTMLImageElement).src = "/listing/bedroompic.png";
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     <div className="flex-1 w-full">
//                                                         <div className="flex items-start justify-between flex-col md:flex-row w-full md:w-auto gap-2">
//                                                             <div>
//                                                                 <p className="font-semibold text-white text-lg">{property.title}</p>
//                                                                 <p className="text-sm text-gray-300">
//                                                                     {property.location} • {property.propertyType}
//                                                                 </p>
//                                                                 <p className="text-sm mt-1">
//                                                                     {formatDate(property.availableFrom)} - {formatDate(property.availableTo)}
//                                                                 </p>
//                                                                 <p className="text-white font-medium mt-1">
//                                                                     {property.maxGuests} Guest{property.maxGuests !== 1 ? "s" : ""} · £{property.price}
//                                                                 </p>
//                                                             </div>
//                                                             <div className="flex items-center gap-2">
//                                                                 <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(property.status)}`}>{property.status}</span>
//                                                                 <span className="text-xs bg-[#2D3546] px-2 py-1 rounded">#{property.propertyNumber}</span>
//                                                                 {property.featured && <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Featured</span>}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <DropdownMenu>
//                                                     <DropdownMenuTrigger asChild>
//                                                         <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
//                                                             <button className="p-2 rounded-full bg-[#3a4459] hover:bg-[#3a4459] transition md:ml-4 flex flex-end">
//                                                                 <EllipsisVertical className="w-5 h-5 text-white" />
//                                                             </button>
//                                                         </div>
//                                                     </DropdownMenuTrigger>

//                                                     <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
//                                                         {/* Toggle Featured Button */}
//                                                         <DropdownMenuItem className="bg-[#FF6B35] text-white hover:bg-[#e55a2b] justify-center rounded-[20px] cursor-pointer" onSelect={() => handleToggleFeatured(property._id)}>
//                                                             <span className="w-full text-center">Remove Featured</span>
//                                                         </DropdownMenuItem>

//                                                         {/* Toggle Trending Button */}
//                                                         <DropdownMenuItem className={`${property.trending ? "bg-[#FF8C00]" : "bg-[#FFA500]"} text-white hover:opacity-90 justify-center rounded-[20px] cursor-pointer`} onSelect={() => handleToggleTrending(property._id)}>
//                                                             <span className="w-full text-center">{property.trending ? "Remove Trending" : "Set as Trending"}</span>
//                                                         </DropdownMenuItem>

//                                                         <DropdownMenuItem
//                                                             className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white"
//                                                             onSelect={(event) => {
//                                                                 event.preventDefault();
//                                                                 handleHostDetails(property.createdBy);
//                                                             }}
//                                                         >
//                                                             <span className="w-full text-center">Host Details</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onClick={() => router.push(`/dashboard/property-management/edit/${property._id}`)}>
//                                                             <span className="w-full text-center">Edit Property</span>
//                                                         </DropdownMenuItem>
//                                                     </DropdownMenuContent>
//                                                 </DropdownMenu>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Pagination */}
//                                     {meta && meta.totalPages > 1 && (
//                                         <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
//                                             <button onClick={handlePrevPage} disabled={filters.page === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                                 Previous
//                                             </button>

//                                             <div className="text-white text-sm">
//                                                 Page {filters.page} of {meta.totalPages}
//                                                 <span className="text-gray-400 ml-2">({meta.total} total properties)</span>
//                                             </div>

//                                             <button onClick={handleNextPage} disabled={filters.page >= meta.totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                                 Next
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </TabsContent>

//                     {/* Trending Properties Tab */}
//                     <TabsContent value="trending">
//                         <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
//                             <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
//                                 <span className="font-semibold text-[28px]">Trending Properties</span>
//                                 <div className="text-right w-full md:w-auto">
//                                     <span className="block">Total: £{totalRevenue}</span>
//                                     <span className="text-sm text-gray-400">
//                                         Showing {properties.length} of {meta?.total} properties
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Search for Trending Properties */}
//                             <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
//                                 <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                                     <div className="relative flex-1 w-full">
//                                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                         <input type="text" placeholder="Search trending properties..." value={filters.search} onChange={handleSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                                     </div>

//                                     {filters.search && (
//                                         <button onClick={clearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
//                                             Clear
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>

//                             {isLoading ? (
//                                 <div className="text-center py-8">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
//                                     <p className="mt-4">Loading trending properties...</p>
//                                 </div>
//                             ) : properties.length === 0 ? (
//                                 <div className="text-center py-8">
//                                     <p className="text-lg">No trending properties found</p>
//                                     {filters.search ? (
//                                         <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
//                                             Clear search
//                                         </button>
//                                     ) : null}
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="space-y-3">
//                                         {properties.map((property: any) => (
//                                             <div key={property._id} className="p-4 rounded-[12px] flex justify-between items-center border border-[#C9A94D] flex-col md:flex-row">
//                                                 <div className="flex items-center gap-4 flex-1 flex-col md:flex-row w-full md:w-auto">
//                                                     <div className="relative w-28 h-20 flex-shrink-0">
//                                                         <Image
//                                                             src={`${process.env.NEXT_PUBLIC_BASE_API}${property.coverPhoto}`}
//                                                             alt={property.title}
//                                                             fill
//                                                             className="object-cover rounded-lg"
//                                                             onError={(e) => {
//                                                                 (e.target as HTMLImageElement).src = "/listing/bedroompic.png";
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     <div className="flex-1 w-full">
//                                                         <div className="flex items-start justify-between flex-col md:flex-row w-full md:w-auto gap-2">
//                                                             <div>
//                                                                 <p className="font-semibold text-white text-lg">{property.title}</p>
//                                                                 <p className="text-sm text-gray-300">
//                                                                     {property.location} • {property.propertyType}
//                                                                 </p>
//                                                                 <p className="text-sm mt-1">
//                                                                     {formatDate(property.availableFrom)} - {formatDate(property.availableTo)}
//                                                                 </p>
//                                                                 <p className="text-white font-medium mt-1">
//                                                                     {property.maxGuests} Guest{property.maxGuests !== 1 ? "s" : ""} · £{property.price}
//                                                                 </p>
//                                                             </div>
//                                                             <div className="flex items-center gap-2">
//                                                                 <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(property.status)}`}>{property.status}</span>
//                                                                 <span className="text-xs bg-[#2D3546] px-2 py-1 rounded">#{property.propertyNumber}</span>
//                                                                 {property.trending && <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">Trending</span>}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <DropdownMenu>
//                                                     <DropdownMenuTrigger asChild>
//                                                         <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
//                                                             <button className="p-2 rounded-full bg-[#3a4459] hover:bg-[#3a4459] transition md:ml-4 flex flex-end">
//                                                                 <EllipsisVertical className="w-5 h-5 text-white" />
//                                                             </button>
//                                                         </div>
//                                                     </DropdownMenuTrigger>

//                                                     <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
//                                                         {/* Toggle Trending Button */}
//                                                         <DropdownMenuItem className="bg-[#FF8C00] text-white hover:bg-[#e07b00] justify-center rounded-[20px] cursor-pointer" onSelect={() => handleToggleTrending(property._id)}>
//                                                             <span className="w-full text-center">Remove Trending</span>
//                                                         </DropdownMenuItem>

//                                                         {/* Toggle Featured Button */}
//                                                         <DropdownMenuItem className={`${property.featured ? "bg-[#FF6B35]" : "bg-[#FFA500]"} text-white hover:opacity-90 justify-center rounded-[20px] cursor-pointer`} onSelect={() => handleToggleFeatured(property._id)}>
//                                                             <span className="w-full text-center">{property.featured ? "Remove Featured" : "Set as Featured"}</span>
//                                                         </DropdownMenuItem>

//                                                         <DropdownMenuItem
//                                                             className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white"
//                                                             onSelect={(event) => {
//                                                                 event.preventDefault();
//                                                                 handleHostDetails(property.createdBy);
//                                                             }}
//                                                         >
//                                                             <span className="w-full text-center">Host Details</span>
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onClick={() => router.push(`/dashboard/property-management/edit/${property._id}`)}>
//                                                             <span className="w-full text-center">Edit Property</span>
//                                                         </DropdownMenuItem>
//                                                     </DropdownMenuContent>
//                                                 </DropdownMenu>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Pagination */}
//                                     {meta && meta.totalPages > 1 && (
//                                         <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
//                                             <button onClick={handlePrevPage} disabled={filters.page === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                                 Previous
//                                             </button>

//                                             <div className="text-white text-sm">
//                                                 Page {filters.page} of {meta.totalPages}
//                                                 <span className="text-gray-400 ml-2">({meta.total} total properties)</span>
//                                             </div>

//                                             <button onClick={handleNextPage} disabled={filters.page >= meta.totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
//                                                 Next
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </TabsContent>
//                 </Tabs>
//             </div>

//             {/* Host Details Modal */}
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
//                     <DialogTitle> </DialogTitle>
//                     {selectedHost && (
//                         <div className="mt-4 space-y-2 text-[#C9A94D]">
//                             <div className="flex items-center justify-center mb-4 flex-col">
//                                 <div className="relative w-24 h-24 rounded-full mb-2 border border-[#C9A94D] overflow-hidden">
//                                     <Image
//                                         src={selectedHost.profileImg ? `${process.env.NEXT_PUBLIC_BASE_API}${selectedHost.profileImg}` : "/listing/hostImage.png"}
//                                         alt="Host image"
//                                         fill
//                                         className="object-cover"
//                                         onError={(e) => {
//                                             (e.target as HTMLImageElement).src = "/listing/hostImage.png";
//                                         }}
//                                     />
//                                 </div>
//                                 <button onClick={() => createConversion(selectedHost._id)} className="flex items-center gap-2 mt-2 text-white hover:opacity-80 transition-opacity">
//                                     <Image src="/listing/messages-dots.png" alt="Message" height={24} width={24} />
//                                     Message Host
//                                 </button>
//                             </div>
//                             <p className="font-bold text-xl md:text-[28px] text-white text-center">{selectedHost.name}</p>

//                             <div className="flex items-center gap-2 text-[18px] font-bold">
//                                 <Image src="/listing/mail.png" alt="Mail" height={24} width={24}></Image>
//                                 <p>{selectedHost.email}</p>
//                             </div>
//                             <div className="flex items-center gap-2 text-[18px] font-bold">
//                                 <Image src="/listing/phone.png" alt="Phone" height={24} width={24}></Image>
//                                 <p>{selectedHost.phone}</p>
//                             </div>
//                             <div className="flex items-center justify-center">
//                                 <button className={`flex items-center gap-1 px-7 py-1 rounded-[20px] text-base justify-center ${selectedHost.isVerifiedByAdmin ? "bg-[#135E9A] text-white" : "bg-red-600 text-white"}`}>
//                                     {selectedHost.isVerifiedByAdmin && <Star className="w-4 h-4" />}
//                                     {selectedHost.isVerifiedByAdmin ? "Verified" : "Unverified"}
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                     <DialogFooter></DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default PropertyManagement;

"use client";
import React, { useState, useEffect } from "react";
import { Star, Search } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useChangePropertyStatusMutation, useGetAllPropertiesForAdminQuery, useGetPublishedPropertiesForAdminQuery, useTogglePropertyFeaturedMutation, useTogglePropertyTrendingMutation } from "@/redux/features/property/propertyApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateConversationMutation } from "@/redux/features/messages/messageApi";

const PropertyManagement = () => {
    const [open, setOpen] = useState(false);
    const [selectedHost, setSelectedHost] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("non-published");
    const router = useRouter();
    const [createConversation] = useCreateConversationMutation();

    // Add the toggle mutations
    const [toggleFeatured] = useTogglePropertyFeaturedMutation();
    const [toggleTrending] = useTogglePropertyTrendingMutation();

    const createConversion = async (hostId: string) => {
        try {
            await createConversation({
                participants: [hostId!],
            }).unwrap();
        } catch (error) {
            console.log("Error creating conversation:", error);
        }
    };

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        status: "",
    });

    // Reset to page 1 when filters change (except page itself)
    useEffect(() => {
        setFilters((prev) => ({ ...prev, page: 1 }));
    }, [filters.search, filters.status, activeTab]);

    // Use different queries based on active tab with type parameter
    const { data: nonPublishedData, isLoading: nonPublishedLoading, refetch: refetchNonPublished } = useGetAllPropertiesForAdminQuery(activeTab === "non-published" ? filters : undefined);

    const { data: publishedData, isLoading: publishedLoading, refetch: refetchPublished } = useGetPublishedPropertiesForAdminQuery(activeTab === "published" ? { ...filters, type: undefined } : undefined);

    const { data: featuredData, isLoading: featuredLoading, refetch: refetchFeatured } = useGetPublishedPropertiesForAdminQuery(activeTab === "featured" ? { ...filters, type: "featured" } : undefined);

    const { data: trendingData, isLoading: trendingLoading, refetch: refetchTrending } = useGetPublishedPropertiesForAdminQuery(activeTab === "trending" ? { ...filters, type: "trending" } : undefined);

    // Select data based on active tab
    const getDataByTab = () => {
        switch (activeTab) {
            case "non-published":
                return nonPublishedData;
            case "published":
                return publishedData;
            case "featured":
                return featuredData;
            case "trending":
                return trendingData;
            default:
                return nonPublishedData;
        }
    };

    const getLoadingByTab = () => {
        switch (activeTab) {
            case "non-published":
                return nonPublishedLoading;
            case "published":
                return publishedLoading;
            case "featured":
                return featuredLoading;
            case "trending":
                return trendingLoading;
            default:
                return nonPublishedLoading;
        }
    };

    const data = getDataByTab();
    const isLoading = getLoadingByTab();
    const properties = data?.data || [];
    const meta = data?.meta || {
        page: 1,
        limit: 10,
        total: 0,
        totalAmount: 0,
    };

    // Calculate totalPages based on total and limit
    const totalPages = Math.ceil(meta.total / filters.limit);
    const currentPage = filters.page;
    const totalProperties = meta.total || 0;
    const showingFrom = totalProperties > 0 ? (currentPage - 1) * filters.limit + 1 : 0;
    const showingTo = Math.min(currentPage * filters.limit, totalProperties);

    const handleHostDetails = (host: any) => {
        setSelectedHost(host);
        setOpen(true);
    };

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

    const totalRevenue = meta?.totalAmount || properties.reduce((sum: number, property: any) => sum + (property.price || 0), 0);

    // Fixed Pagination handlers
    const handleNextPage = () => {
        if (filters.page < totalPages) {
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrevPage = () => {
        if (filters.page > 1) {
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, search: e.target.value }));
    };

    const handleStatusFilter = (status: string) => {
        setFilters((prev) => ({ ...prev, status }));
    };

    const clearFilters = () => {
        setFilters({ page: 1, limit: 10, search: "", status: "" });
    };

    const [changeStatus] = useChangePropertyStatusMutation();

    const handlePropertyStatusChange = async (propertyId: string, newStatus: string) => {
        try {
            await changeStatus({ id: propertyId, status: newStatus }).unwrap();
            toast.success("Status updated successfully");

            // Refetch data after status change
            switch (activeTab) {
                case "non-published":
                    refetchNonPublished();
                    break;
                case "published":
                    refetchPublished();
                    break;
                case "featured":
                    refetchFeatured();
                    break;
                case "trending":
                    refetchTrending();
                    break;
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // Updated toggle handlers using the mutations
    const handleToggleFeatured = async (propertyId: string) => {
        try {
            await toggleFeatured(propertyId).unwrap();
            toast.success("Featured status updated");

            // Refetch data after toggle
            switch (activeTab) {
                case "published":
                    refetchPublished();
                    break;
                case "featured":
                    refetchFeatured();
                    break;
                case "trending":
                    refetchTrending();
                    break;
            }
        } catch (error) {
            toast.error("Failed to update featured status");
        }
    };

    const handleToggleTrending = async (propertyId: string) => {
        try {
            await toggleTrending(propertyId).unwrap();
            toast.success("Trending status updated");

            // Refetch data after toggle
            switch (activeTab) {
                case "published":
                    refetchPublished();
                    break;
                case "featured":
                    refetchFeatured();
                    break;
                case "trending":
                    refetchTrending();
                    break;
            }
        } catch (error) {
            toast.error("Failed to update trending status");
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setFilters((prev) => ({ ...prev, page: 1, search: "", status: "" }));
    };

    return (
        <div className="container mx-auto">
            <PageHeader title={"Property Management"}></PageHeader>

            <div className="flex items-center mb-6">
                <Link href={"/dashboard/listing/add"} className="w-auto cursor-pointer">
                    <button className="py-3 px-4 md:px-10 bg-[#C9A94D] text-white flex gap-2 md:gap-3 items-center rounded-[10px] cursor-pointer">
                        <Image src="/listing/add/plus-square.png" alt="Plus Icon" width={24} height={24} />
                        Add Properties Manually
                    </button>
                </Link>
            </div>

            <div className="w-full">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    {/* Tab Triggers */}
                    <TabsList className="flex h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-6 w-full flex-col md:flex-row">
                        <TabsTrigger value="non-published" className="p-3 h-auto rounded-[10px] w-full md:w-1/4 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
                            Property Management
                        </TabsTrigger>
                        <TabsTrigger value="published" className="p-3 h-auto rounded-[10px] w-full md:w-1/4 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                            Published Properties
                        </TabsTrigger>
                        <TabsTrigger value="featured" className="p-3 h-auto rounded-[10px] w-full md:w-1/4 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                            Featured Properties
                        </TabsTrigger>
                        <TabsTrigger value="trending" className="p-3 h-auto rounded-[10px] w-full md:w-1/4 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                            Trending Properties
                        </TabsTrigger>
                    </TabsList>

                    {/* Non-Published Properties Tab */}
                    <TabsContent value="non-published">
                        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
                            <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
                                <span className="font-semibold text-[28px]">Property Management</span>
                                <div className="text-right w-full md:w-auto">
                                    <span className="block">Total: £{totalRevenue}</span>
                                    <span className="text-sm text-gray-400">
                                        Showing {showingFrom}-{showingTo} of {totalProperties} properties
                                    </span>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    {/* Search */}
                                    <div className="relative flex-1 w-full">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" placeholder="Search properties..." value={filters.search} onChange={handleSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                                    </div>

                                    {/* Status Filter */}
                                    <div className="flex gap-2 flex-wrap">
                                        <select value={filters.status} onChange={(e) => handleStatusFilter(e.target.value)} className="px-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white focus:outline-none focus:ring-2 focus:ring-[#C9A94D]">
                                            <option value="">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="hidden">Hidden</option>
                                        </select>

                                        {(filters.search || filters.status) && (
                                            <button onClick={clearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
                                                Clear
                                            </button>
                                        )}
                                    </div>
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
                                    {filters.search || filters.status ? (
                                        <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
                                            Clear filters
                                        </button>
                                    ) : null}
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
                                                            <button className="p-2 rounded-full bg-[#3a4459] hover:bg-[#3a4459] transition md:ml-4 flex flex-end">
                                                                <EllipsisVertical className="w-5 h-5 text-white" />
                                                            </button>
                                                        </div>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
                                                        <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "published")}>
                                                            <span className="w-full text-center">Publish</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#b30000] focus:bg-[#b30000] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "rejected")}>
                                                            <span className="w-full text-center">Reject</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "hidden")}>
                                                            <span className="w-full text-center">Hide</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white"
                                                            onSelect={(event) => {
                                                                event.preventDefault();
                                                                handleHostDetails(property.createdBy);
                                                            }}
                                                        >
                                                            <span className="w-full text-center">Host Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onClick={() => router.push(`/dashboard/property-management/edit/${property._id}`)}>
                                                            <span className="w-full text-center">Edit Property</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
                                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                                Previous
                                            </button>

                                            <div className="text-white text-sm">
                                                Page {currentPage} of {totalPages}
                                                <span className="text-gray-400 ml-2">({totalProperties} total properties)</span>
                                            </div>

                                            <button onClick={handleNextPage} disabled={currentPage >= totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </TabsContent>

                    {/* Published Properties Tab */}
                    <TabsContent value="published">
                        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
                            <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
                                <span className="font-semibold text-[28px]">Published Properties</span>
                                <div className="text-right w-full md:w-auto">
                                    <span className="block">Total: £{totalRevenue}</span>
                                    <span className="text-sm text-gray-400">
                                        Showing {showingFrom}-{showingTo} of {totalProperties} properties
                                    </span>
                                </div>
                            </div>

                            {/* Search and Filters - Only search for published tab */}
                            <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    {/* Search */}
                                    <div className="relative flex-1 w-full">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" placeholder="Search published properties..." value={filters.search} onChange={handleSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                                    </div>

                                    {/* Clear filter button */}
                                    {filters.search && (
                                        <button onClick={clearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                                    <p className="mt-4">Loading published properties...</p>
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-lg">No published properties found</p>
                                    {filters.search ? (
                                        <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
                                            Clear search
                                        </button>
                                    ) : null}
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
                                                            <button className="p-2 rounded-full bg-[#3a4459] hover:bg-[#3a4459] transition md:ml-4 flex flex-end">
                                                                <EllipsisVertical className="w-5 h-5 text-white" />
                                                            </button>
                                                        </div>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
                                                        {/* Toggle Featured Button */}
                                                        <DropdownMenuItem className={`${property.featured ? "bg-[#FF6B35]" : "bg-[#FFA500]"} text-white hover:opacity-90 justify-center rounded-[20px] cursor-pointer`} onSelect={() => handleToggleFeatured(property._id)}>
                                                            <span className="w-full text-center">{property.featured ? "Remove Featured" : "Set as Featured"}</span>
                                                        </DropdownMenuItem>

                                                        {/* Toggle Trending Button */}
                                                        <DropdownMenuItem className={`${property.trending ? "bg-[#FF8C00]" : "bg-[#FFA500]"} text-white hover:opacity-90 justify-center rounded-[20px] cursor-pointer`} onSelect={() => handleToggleTrending(property._id)}>
                                                            <span className="w-full text-center">{property.trending ? "Remove Trending" : "Set as Trending"}</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#b30000] focus:bg-[#b30000] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "rejected")}>
                                                            <span className="w-full text-center">Reject</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "hidden")}>
                                                            <span className="w-full text-center">Hide</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white" onSelect={() => handlePropertyStatusChange(property._id, "pending")}>
                                                            <span className="w-full text-center">Set to Pending</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white"
                                                            onSelect={(event) => {
                                                                event.preventDefault();
                                                                handleHostDetails(property.createdBy);
                                                            }}
                                                        >
                                                            <span className="w-full text-center">Host Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onClick={() => router.push(`/dashboard/property-management/edit/${property._id}`)}>
                                                            <span className="w-full text-center">Edit Property</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
                                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                                Previous
                                            </button>

                                            <div className="text-white text-sm">
                                                Page {currentPage} of {totalPages}
                                                <span className="text-gray-400 ml-2">({totalProperties} total properties)</span>
                                            </div>

                                            <button onClick={handleNextPage} disabled={currentPage >= totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </TabsContent>

                    {/* Featured Properties Tab */}
                    <TabsContent value="featured">
                        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
                            <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
                                <span className="font-semibold text-[28px]">Featured Properties</span>
                                <div className="text-right w-full md:w-auto">
                                    <span className="block">Total: £{totalRevenue}</span>
                                    <span className="text-sm text-gray-400">
                                        Showing {showingFrom}-{showingTo} of {totalProperties} properties
                                    </span>
                                </div>
                            </div>

                            {/* Search for Featured Properties */}
                            <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="relative flex-1 w-full">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" placeholder="Search featured properties..." value={filters.search} onChange={handleSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                                    </div>

                                    {filters.search && (
                                        <button onClick={clearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                                    <p className="mt-4">Loading featured properties...</p>
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-lg">No featured properties found</p>
                                    {filters.search ? (
                                        <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
                                            Clear search
                                        </button>
                                    ) : null}
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
                                                                {property.featured && <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Featured</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
                                                            <button className="p-2 rounded-full bg-[#3a4459] hover:bg-[#3a4459] transition md:ml-4 flex flex-end">
                                                                <EllipsisVertical className="w-5 h-5 text-white" />
                                                            </button>
                                                        </div>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
                                                        {/* Toggle Featured Button */}
                                                        <DropdownMenuItem className="bg-[#FF6B35] text-white hover:bg-[#e55a2b] justify-center rounded-[20px] cursor-pointer" onSelect={() => handleToggleFeatured(property._id)}>
                                                            <span className="w-full text-center">Remove Featured</span>
                                                        </DropdownMenuItem>

                                                        {/* Toggle Trending Button */}
                                                        <DropdownMenuItem className={`${property.trending ? "bg-[#FF8C00]" : "bg-[#FFA500]"} text-white hover:opacity-90 justify-center rounded-[20px] cursor-pointer`} onSelect={() => handleToggleTrending(property._id)}>
                                                            <span className="w-full text-center">{property.trending ? "Remove Trending" : "Set as Trending"}</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white"
                                                            onSelect={(event) => {
                                                                event.preventDefault();
                                                                handleHostDetails(property.createdBy);
                                                            }}
                                                        >
                                                            <span className="w-full text-center">Host Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onClick={() => router.push(`/dashboard/property-management/edit/${property._id}`)}>
                                                            <span className="w-full text-center">Edit Property</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
                                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                                Previous
                                            </button>

                                            <div className="text-white text-sm">
                                                Page {currentPage} of {totalPages}
                                                <span className="text-gray-400 ml-2">({totalProperties} total properties)</span>
                                            </div>

                                            <button onClick={handleNextPage} disabled={currentPage >= totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </TabsContent>

                    {/* Trending Properties Tab */}
                    <TabsContent value="trending">
                        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-6 text-[#C9A94D] rounded-[20px] space-y-4">
                            <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
                                <span className="font-semibold text-[28px]">Trending Properties</span>
                                <div className="text-right w-full md:w-auto">
                                    <span className="block">Total: £{totalRevenue}</span>
                                    <span className="text-sm text-gray-400">
                                        Showing {showingFrom}-{showingTo} of {totalProperties} properties
                                    </span>
                                </div>
                            </div>

                            {/* Search for Trending Properties */}
                            <div className="bg-[#2D3546] border border-[#C9A94D] p-4 rounded-[12px] mb-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="relative flex-1 w-full">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" placeholder="Search trending properties..." value={filters.search} onChange={handleSearch} className="w-full pl-10 pr-4 py-2 bg-[#434D64] border border-[#C9A94D] rounded-[8px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                                    </div>

                                    {filters.search && (
                                        <button onClick={clearFilters} className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 transition">
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                                    <p className="mt-4">Loading trending properties...</p>
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-lg">No trending properties found</p>
                                    {filters.search ? (
                                        <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-[#C9A94D] text-white rounded-[8px] hover:bg-[#b8973e] transition">
                                            Clear search
                                        </button>
                                    ) : null}
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
                                                                {property.trending && <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">Trending</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <div className="w-full md:w-auto flex justify-end mt-3 md:mt-0">
                                                            <button className="p-2 rounded-full bg-[#3a4459] hover:bg-[#3a4459] transition md:ml-4 flex flex-end">
                                                                <EllipsisVertical className="w-5 h-5 text-white" />
                                                            </button>
                                                        </div>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
                                                        {/* Toggle Trending Button */}
                                                        <DropdownMenuItem className="bg-[#FF8C00] text-white hover:bg-[#e07b00] justify-center rounded-[20px] cursor-pointer" onSelect={() => handleToggleTrending(property._id)}>
                                                            <span className="w-full text-center">Remove Trending</span>
                                                        </DropdownMenuItem>

                                                        {/* Toggle Featured Button */}
                                                        <DropdownMenuItem className={`${property.featured ? "bg-[#FF6B35]" : "bg-[#FFA500]"} text-white hover:opacity-90 justify-center rounded-[20px] cursor-pointer`} onSelect={() => handleToggleFeatured(property._id)}>
                                                            <span className="w-full text-center">{property.featured ? "Remove Featured" : "Set as Featured"}</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            className="bg-[#C9A94D] text-white hover:bg-[#b8973e] focus:bg-[#b8973e] justify-center rounded-[20px] cursor-pointer focus:text-white"
                                                            onSelect={(event) => {
                                                                event.preventDefault();
                                                                handleHostDetails(property.createdBy);
                                                            }}
                                                        >
                                                            <span className="w-full text-center">Host Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#0f4a7a] focus:bg-[#0f4a7a] justify-center rounded-[20px] cursor-pointer focus:text-white" onClick={() => router.push(`/dashboard/property-management/edit/${property._id}`)}>
                                                            <span className="w-full text-center">Edit Property</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] flex-col md:flex-row gap-4">
                                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                                Previous
                                            </button>

                                            <div className="text-white text-sm">
                                                Page {currentPage} of {totalPages}
                                                <span className="text-gray-400 ml-2">({totalProperties} total properties)</span>
                                            </div>

                                            <button onClick={handleNextPage} disabled={currentPage >= totalPages} className="flex items-center gap-2 px-4 py-2 bg-[#434D64] text-white rounded-[8px] hover:bg-[#535a6b] disabled:opacity-50 disabled:cursor-not-allowed transition">
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Host Details Modal */}
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
                    <DialogTitle> </DialogTitle>
                    {selectedHost && (
                        <div className="mt-4 space-y-2 text-[#C9A94D]">
                            <div className="flex items-center justify-center mb-4 flex-col">
                                <div className="relative w-24 h-24 rounded-full mb-2 border border-[#C9A94D] overflow-hidden">
                                    <Image
                                        src={selectedHost.profileImg ? `${process.env.NEXT_PUBLIC_BASE_API}${selectedHost.profileImg}` : "/listing/hostImage.png"}
                                        alt="Host image"
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/listing/hostImage.png";
                                        }}
                                    />
                                </div>
                                <button onClick={() => createConversion(selectedHost._id)} className="flex items-center gap-2 mt-2 text-white hover:opacity-80 transition-opacity">
                                    <Image src="/listing/messages-dots.png" alt="Message" height={24} width={24} />
                                    Message Host
                                </button>
                            </div>
                            <p className="font-bold text-xl md:text-[28px] text-white text-center">{selectedHost.name}</p>

                            <div className="flex items-center gap-2 text-[18px] font-bold">
                                <Image src="/listing/mail.png" alt="Mail" height={24} width={24}></Image>
                                <p>{selectedHost.email}</p>
                            </div>
                            <div className="flex items-center gap-2 text-[18px] font-bold">
                                <Image src="/listing/phone.png" alt="Phone" height={24} width={24}></Image>
                                <p>{selectedHost.phone}</p>
                            </div>
                            <div className="flex items-center justify-center">
                                <button className={`flex items-center gap-1 px-7 py-1 rounded-[20px] text-base justify-center ${selectedHost.isVerifiedByAdmin ? "bg-[#135E9A] text-white" : "bg-red-600 text-white"}`}>
                                    {selectedHost.isVerifiedByAdmin && <Star className="w-4 h-4" />}
                                    {selectedHost.isVerifiedByAdmin ? "Verified" : "Unverified"}
                                </button>
                            </div>
                        </div>
                    )}
                    <DialogFooter></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PropertyManagement;
