"use client";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingType, useGetAllRatingsForAdminQuery, useUpdateRatingStatusMutation, useDeleteRatingMutation, RatingStatus } from "@/redux/features/rating/ratingApi";
import { toast } from "sonner";

const PropertyManagement = () => {
    const [activeTab, setActiveTab] = useState<RatingType>(RatingType.SITE);
    const [openRow, setOpenRow] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    // Use the Redux query hook with pagination
    const {
        data: ratingsData,
        isLoading,
        refetch,
    } = useGetAllRatingsForAdminQuery({
        type: activeTab,
        page: currentPage,
        limit: limit,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    // Mutation hooks for actions
    const [updateRatingStatus] = useUpdateRatingStatusMutation();
    const [deleteRating] = useDeleteRatingMutation();

    const reviews = ratingsData?.data || [];
    const totalItems = ratingsData?.meta?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const getPropertyName = (rating: any) => {
        if (rating.type === RatingType.SITE) return "Site Review";
        return rating.propertyId?.title || "Property Review";
    };

    const getRatingCategories = (rating: any) => {
        if (rating.type === RatingType.PROPERTY) {
            return [
                { name: "Communication", value: rating.communication },
                { name: "Accuracy of Listing", value: rating.accuracy },
                { name: "Cleanliness", value: rating.cleanliness },
                { name: "Check-In Experience", value: rating.checkInExperience },
                { name: "Overall Experience", value: rating.overallExperience },
            ];
        } else {
            return [{ name: "Overall Experience", value: rating.overallExperience }];
        }
    };

    const handleAction = async (action: string, ratingId: string) => {
        try {
            if (action === "delete") {
                await deleteRating(ratingId).unwrap();
                toast.success("Review deleted successfully");
            } else {
                let status: RatingStatus;
                switch (action) {
                    case "approve":
                        status = RatingStatus.APPROVED;
                        break;
                    case "reject":
                        status = RatingStatus.REJECTED;
                        break;
                    case "pending":
                        status = RatingStatus.PENDING;
                        break;
                    default:
                        status = RatingStatus.PENDING;
                }

                await updateRatingStatus({ ratingId, status }).unwrap();
                toast.success(`Review ${action}d successfully`);
            }

            refetch();
            setOpenRow(null);
        } catch (error: any) {
            console.error("Action failed:", error);
            toast.error(error?.data?.message || `Failed to ${action} review`);
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value as RatingType);
        setCurrentPage(1); // Reset to first page when tab changes
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const getStatusBadge = (status: RatingStatus) => {
        const statusConfig = {
            [RatingStatus.PENDING]: { color: "bg-yellow-500", text: "Pending" },
            [RatingStatus.APPROVED]: { color: "bg-green-500", text: "Approved" },
            [RatingStatus.REJECTED]: { color: "bg-red-500", text: "Rejected" },
        };

        const config = statusConfig[status];
        return <span className={`px-2 py-1 rounded-full text-xs text-white ${config.color}`}>{config.text}</span>;
    };

    return (
        <div className="container mx-auto">
            <PageHeader title="Reviews" />

            <div className="w-full">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    {/* Tab Triggers */}
                    <TabsList className="flex h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-6 w-full flex-col md:flex-row">
                        <TabsTrigger value={RatingType.SITE} className="p-3 h-auto rounded-[10px] w-full md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
                            Site Reviews
                        </TabsTrigger>
                        <TabsTrigger value={RatingType.PROPERTY} className="p-3 h-auto rounded-[10px] w-full md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                            Property Reviews
                        </TabsTrigger>
                    </TabsList>

                    {/* All Tabs Content */}
                    <TabsContent value={RatingType.SITE}>
                        <ReviewContent
                            reviews={reviews}
                            isLoading={isLoading}
                            activeTab={activeTab}
                            openRow={openRow}
                            setOpenRow={setOpenRow}
                            formatDate={formatDate}
                            getPropertyName={getPropertyName}
                            getRatingCategories={getRatingCategories}
                            getStatusBadge={getStatusBadge}
                            handleAction={handleAction}
                            // Pagination props
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>

                    <TabsContent value={RatingType.PROPERTY}>
                        <ReviewContent
                            reviews={reviews}
                            isLoading={isLoading}
                            activeTab={activeTab}
                            openRow={openRow}
                            setOpenRow={setOpenRow}
                            formatDate={formatDate}
                            getPropertyName={getPropertyName}
                            getRatingCategories={getRatingCategories}
                            getStatusBadge={getStatusBadge}
                            handleAction={handleAction}
                            // Pagination props
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

// Review Content Component
const ReviewContent = ({
    reviews,
    isLoading,
    activeTab,
    openRow,
    setOpenRow,
    formatDate,
    getPropertyName,
    getRatingCategories,
    getStatusBadge,
    handleAction,
    // Pagination props
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
}: any) => {
    return (
        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D] rounded-[20px] space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <span className="text-[#C9A94D] text-xl md:text-[28px]">
                    {activeTab === RatingType.SITE ? "Site" : "Property"} Reviews
                    <span className="text-sm ml-2 text-gray-400">({totalItems} total)</span>
                </span>
            </div>

            {/* Review Rows */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8 text-[#C9A94D]">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8 text-[#C9A94D]">No reviews found</div>
                ) : (
                    reviews.map((row: any, i: number) => (
                        <div key={row._id} className="p-4 rounded-[12px] border border-[#C9A94D] bg-[#1a2235]">
                            {/* Main Row - Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-2 items-center mb-4">
                                {/* Property */}
                                <div className="text-center md:text-left">
                                    <p className="font-bold text-lg mb-1">Properties</p>
                                    <span className="text-sm">{getPropertyName(row)}</span>
                                </div>

                                {/* Date */}
                                <div className="text-center md:text-left">
                                    <p className="font-bold text-lg mb-1">Date</p>
                                    <span className="text-sm">{formatDate(row.createdAt)}</span>
                                </div>

                                {/* Name */}
                                <div className="text-center md:text-left">
                                    <p className="font-bold text-lg mb-1">Name</p>
                                    <span className="text-sm">{row.userId?.name || "N/A"}</span>
                                </div>

                                {/* Email */}
                                <div className="text-center md:text-left">
                                    <p className="font-bold text-lg mb-1">Email</p>
                                    <span className="text-sm break-all">{row.userId?.email || "N/A"}</span>
                                </div>

                                {/* Rating */}
                                <div className="text-center md:text-left">
                                    <p className="font-bold text-lg mb-1">Rating</p>
                                    <span className="text-sm">{row.overallExperience}/5</span>
                                </div>

                                {/* Status */}
                                <div className="text-center md:text-left">
                                    <p className="font-bold text-lg mb-1">Status</p>
                                    <div className="flex justify-center md:justify-start">{getStatusBadge(row.status)}</div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                                    {/* Review Details Button */}
                                    <Dialog open={openRow === row._id} onOpenChange={(isOpen) => setOpenRow(isOpen ? row._id : null)}>
                                        <DialogTrigger asChild>
                                            <button className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-[14px] py-2 px-4 w-full sm:w-auto hover:bg-[#b89742] transition-colors">Review Details</button>
                                        </DialogTrigger>

                                        <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 max-w-md mx-auto">
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
                                                <DialogTitle className="text-[#C9A94D] text-lg font-bold text-center">Review Details - {getPropertyName(row)}</DialogTitle>
                                            </DialogHeader>

                                            <div className="space-y-5">
                                                {getRatingCategories(row).map((category: any) => (
                                                    <div key={category.name} className="flex flex-col gap-2">
                                                        <span className="text-[#C9A94D] font-medium">{category.name}</span>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star key={star} className={`w-6 h-6 ${(category.value || 0) >= star ? "fill-[#C9A94D] text-[#C9A94D]" : "text-gray-500"}`} />
                                                            ))}
                                                        </div>
                                                        <span className="text-white text-sm">Rating: {category.value}/5</span>
                                                    </div>
                                                ))}

                                                {row.description && (
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-[#C9A94D] font-medium">Comment</span>
                                                        <p className="text-white text-sm bg-[#2D3546] p-3 rounded-lg">{row.description}</p>
                                                    </div>
                                                )}

                                                {row.country && (
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-[#C9A94D] font-medium">Country</span>
                                                        <p className="text-white text-sm">{row.country}</p>
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[#C9A94D] font-medium">Status</span>
                                                    <div className="flex justify-center">{getStatusBadge(row.status)}</div>
                                                </div>
                                            </div>

                                            <DialogFooter></DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Dropdown Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 rounded-full bg-[#434D64] w-10 h-10 flex items-center justify-center hover:bg-[#135E9A] transition-colors">
                                                <EllipsisVertical className="w-5 h-5 text-white" />
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-3 p-4 border border-[#C9A94D]">
                                            <DropdownMenuItem className="bg-green-600 text-white hover:bg-green-700 focus:bg-green-700 justify-center focus:text-white rounded-[10px] cursor-pointer py-2" onClick={() => handleAction("approve", row._id)}>
                                                <span className="w-full text-center">Approve</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="bg-yellow-600 text-white hover:bg-yellow-700 focus:bg-yellow-700 justify-center focus:text-white rounded-[10px] cursor-pointer py-2" onClick={() => handleAction("pending", row._id)}>
                                                <span className="w-full text-center">Set Pending</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 justify-center focus:text-white rounded-[10px] cursor-pointer py-2" onClick={() => handleAction("reject", row._id)}>
                                                <span className="w-full text-center">Reject</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-red-800 focus:bg-red-800 justify-center focus:text-white rounded-[10px] cursor-pointer py-2" onClick={() => handleAction("delete", row._id)}>
                                                <span className="w-full text-center">Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg bg-[#434D64] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#135E9A] transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex space-x-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button key={pageNum} onClick={() => onPageChange(pageNum)} className={`px-4 py-2 rounded-lg transition-colors ${currentPage === pageNum ? "bg-[#C9A94D] text-white" : "bg-[#434D64] text-white hover:bg-[#135E9A]"}`}>
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-[#434D64] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#135E9A] transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PropertyManagement;
