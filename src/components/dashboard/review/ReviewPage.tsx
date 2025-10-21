// "use client";
// import React, { useState } from "react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { EllipsisVertical, Star } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
// import PageHeader from "@/components/PageHeader";

// // Define categories as const for proper typing
// const categories = ["Communication", "Accuracy of Listing", "Cleanliness", "Check-In Experience", "Overall Experience"] as const;
// type Category = (typeof categories)[number]; // Union of category strings

// // Sample reviews data with typed ratings
// type Ratings = Record<Category, number>;

// type Review = {
//     property: string;
//     date: string;
//     name: string;
//     mail: string;
//     ratings: Ratings;
// };

// const reviews: Review[] = [
//     {
//         property: "Mild town",
//         date: "12/01/2005",
//         name: "John",
//         mail: "john@gmail.com",
//         ratings: { Communication: 5, "Accuracy of Listing": 4, Cleanliness: 5, "Check-In Experience": 4, "Overall Experience": 5 },
//     },
//     {
//         property: "Lake House",
//         date: "15/03/2010",
//         name: "Alice",
//         mail: "alice@gmail.com",
//         ratings: { Communication: 4, "Accuracy of Listing": 4, Cleanliness: 3, "Check-In Experience": 5, "Overall Experience": 4 },
//     },
//     {
//         property: "Mountain View",
//         date: "20/06/2015",
//         name: "Bob",
//         mail: "bob@gmail.com",
//         ratings: { Communication: 3, "Accuracy of Listing": 3, Cleanliness: 4, "Check-In Experience": 4, "Overall Experience": 3 },
//     },
// ];

// const PropertyManagement = () => {
//     const [openRow, setOpenRow] = useState<number | null>(null);

//     return (
//         <div className="container mx-auto">
//             <PageHeader title="Reviews" />

//             <div className="w-full">
//                 <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D] rounded-[20px] space-y-4">
//                     {/* Header */}
//                     <div className="flex justify-between md:items-center flex-col md:flex-row gap-4">
//                         <span className="text-[#C9A94D] text-xl md:text-[28px]">Review</span>

//                         <div className="flex items-center gap-2">
//                             <span className="text-[#C9A94D] text-xl md:text-[28px]">Sort By:</span>
//                             <Select>
//                                 <SelectTrigger className="bg-[#434D64] border border-[#C9A94D] text-[#C9A94D] rounded-[10px] w-36">
//                                     <SelectValue placeholder="Select" />
//                                 </SelectTrigger>

//                                 <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-white rounded-[10px]">
//                                     <SelectItem value="date">Date</SelectItem>
//                                     <SelectItem value="rating">Rating</SelectItem>
//                                     <SelectItem value="price_low">Price: Low to High</SelectItem>
//                                     <SelectItem value="price_high">Price: High to Low</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

//                     {/* Review Rows */}
//                     <div className="space-y-3">
//                         {reviews.map((row, i) => (
//                             <div key={i} className="p-3 rounded-[12px] flex justify-between md:items-center border border-[#C9A94D] flex-col md:flex-row gap-3">
//                                 <div>
//                                     <p className="font-bold text-2xl">Properties</p>
//                                     <span>{row.property}</span>
//                                 </div>
//                                 <div>
//                                     <p className="font-bold text-2xl">Date</p>
//                                     <span>{row.date}</span>
//                                 </div>
//                                 <div>
//                                     <p className="font-bold text-2xl">Name</p>
//                                     <span>{row.name}</span>
//                                 </div>
//                                 <div>
//                                     <p className="font-bold text-2xl">Mail</p>
//                                     <span>{row.mail}</span>
//                                 </div>

//                                 {/* Review Details Dialog */}
//                                 <div>
//                                     <Dialog open={openRow === i} onOpenChange={(isOpen) => setOpenRow(isOpen ? i : null)}>
//                                         <DialogTrigger asChild>
//                                             <button className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-[14px] py-1 px-3 w-full">Review Details</button>
//                                         </DialogTrigger>

//                                         <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[420px]">
//                                             <style jsx global>{`
//                                                 [data-slot="dialog-close"] {
//                                                     color: white !important;
//                                                     opacity: 1 !important;
//                                                 }
//                                                 [data-slot="dialog-close"]:hover {
//                                                     color: #c9a94d !important;
//                                                 }
//                                                 [data-slot="dialog-close"] svg {
//                                                     stroke: currentColor;
//                                                 }
//                                             `}</style>
//                                             <DialogHeader>
//                                                 <DialogTitle className="text-[#C9A94D] text-lg font-bold">Review Details</DialogTitle>
//                                             </DialogHeader>

//                                             <div className="space-y-5">
//                                                 {categories.map((category) => (
//                                                     <div key={category} className="flex flex-col gap-2">
//                                                         <span className="text-[#C9A94D]">{category}</span>
//                                                         <div className="flex gap-2">
//                                                             {[1, 2, 3, 4, 5].map((star) => (
//                                                                 <Star key={star} className={`w-6 h-6 ${row.ratings[category as Category] >= star ? "fill-[#C9A94D] text-[#C9A94D]" : "text-gray-500"}`} />
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>

//                                             <DialogFooter></DialogFooter>
//                                         </DialogContent>
//                                     </Dialog>
//                                 </div>

//                                 {/* Dropdown Menu */}
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <button className="p-2 rounded-full bg-[#434D64] w-9 h-9">
//                                             <EllipsisVertical className="w-5 h-5 text-white" />
//                                         </button>
//                                     </DropdownMenuTrigger>

//                                     <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-[14px] p-5 border-none">
//                                         <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#D00000] focus:bg-[#D00000] justify-center focus:text-white rounded-[20px]">
//                                             <span className="w-full text-center">Cancel</span>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#C9A94D] focus:bg-[#C9A94D] justify-center focus:text-white rounded-[20px]">
//                                             <span className="w-full text-center">Approve</span>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#135E9A] focus:bg-[#135E9A] justify-center focus:text-white rounded-[20px]">
//                                             <span className="w-full text-center">Hide / Hold</span>
//                                         </DropdownMenuItem>
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PropertyManagement;

"use client";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingType, useGetAllRatingsForAdminQuery } from "@/redux/features/rating/ratingApi";
import { toast } from "sonner";

const PropertyManagement = () => {
    const [activeTab, setActiveTab] = useState<RatingType>(RatingType.SITE);
    const [openRow, setOpenRow] = useState<string | null>(null);

    // Use the Redux query hook
    const {
        data: ratingsData,
        isLoading,
        refetch,
    } = useGetAllRatingsForAdminQuery({
        type: activeTab,
        page: 1,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const reviews = ratingsData?.data || [];

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
            console.log(`${action} rating: ${ratingId}`);
            toast.success(`Review ${action} successfully`);
            refetch();
        } catch (error) {
            toast.error(`Failed to ${action} review`);
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value as RatingType);
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
                        <ReviewContent reviews={reviews} isLoading={isLoading} activeTab={activeTab} openRow={openRow} setOpenRow={setOpenRow} formatDate={formatDate} getPropertyName={getPropertyName} getRatingCategories={getRatingCategories} handleAction={handleAction} />
                    </TabsContent>

                    <TabsContent value={RatingType.PROPERTY}>
                        <ReviewContent reviews={reviews} isLoading={isLoading} activeTab={activeTab} openRow={openRow} setOpenRow={setOpenRow} formatDate={formatDate} getPropertyName={getPropertyName} getRatingCategories={getRatingCategories} handleAction={handleAction} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

// Review Content Component (Your original design)
const ReviewContent = ({ reviews, isLoading, activeTab, openRow, setOpenRow, formatDate, getPropertyName, getRatingCategories, handleAction }: any) => {
    return (
        <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D] rounded-[20px] space-y-4">
            {/* Header */}
            <div className="flex justify-between md:items-center flex-col md:flex-row gap-4">
                <span className="text-[#C9A94D] text-xl md:text-[28px]">{activeTab === RatingType.SITE ? "Site" : "Property"} Reviews</span>
            </div>

            {/* Review Rows */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="text-center py-8 text-[#C9A94D]">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8 text-[#C9A94D]">No reviews found</div>
                ) : (
                    reviews.map((row: any, i: number) => (
                        <div key={row._id} className="p-3 rounded-[12px] flex justify-between md:items-center border border-[#C9A94D] flex-col md:flex-row gap-3">
                            <div>
                                <p className="font-bold text-2xl">Properties</p>
                                <span>{getPropertyName(row)}</span>
                            </div>
                            <div>
                                <p className="font-bold text-2xl">Date</p>
                                <span>{formatDate(row.createdAt)}</span>
                            </div>
                            <div>
                                <p className="font-bold text-2xl">Name</p>
                                <span>{row.userId?.name || "N/A"}</span>
                            </div>
                            <div>
                                <p className="font-bold text-2xl">Mail</p>
                                <span>{row.userId?.email || "N/A"}</span>
                            </div>
                            <div>
                                <p className="font-bold text-2xl">Rating</p>
                                <span>{row.overallExperience}/5</span>
                            </div>

                            {/* Review Details Dialog */}
                            <div>
                                <Dialog open={openRow === row._id} onOpenChange={(isOpen) => setOpenRow(isOpen ? row._id : null)}>
                                    <DialogTrigger asChild>
                                        <button className="bg-[#C9A94D] text-white rounded-[10px] font-bold text-[14px] py-1 px-3 w-full">Review Details</button>
                                    </DialogTrigger>

                                    <DialogContent className="bg-[#14213D] border border-[#C9A94D] rounded-[10px] p-6 w-[420px]">
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
                                            <DialogTitle className="text-[#C9A94D] text-lg font-bold">Review Details - {getPropertyName(row)}</DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-5">
                                            {getRatingCategories(row).map((category: any) => (
                                                <div key={category.name} className="flex flex-col gap-2">
                                                    <span className="text-[#C9A94D]">{category.name}</span>
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
                                                    <span className="text-[#C9A94D]">Comment</span>
                                                    <p className="text-white text-sm">{row.description}</p>
                                                </div>
                                            )}

                                            {row.country && (
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[#C9A94D]">Country</span>
                                                    <p className="text-white text-sm">{row.country}</p>
                                                </div>
                                            )}
                                        </div>

                                        <DialogFooter></DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Dropdown Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 rounded-full bg-[#434D64] w-9 h-9">
                                        <EllipsisVertical className="w-5 h-5 text-white" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="bg-[#14213D] text-white rounded-[10px] w-48 flex flex-col gap-[14px] p-5 border-none">
                                    <DropdownMenuItem className="bg-[#D00000] text-white hover:bg-[#D00000] focus:bg-[#D00000] justify-center focus:text-white rounded-[20px] cursor-pointer" onClick={() => handleAction("cancel", row._id)}>
                                        <span className="w-full text-center">Cancel</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="bg-[#C9A94D] text-white hover:bg-[#C9A94D] focus:bg-[#C9A94D] justify-center focus:text-white rounded-[20px] cursor-pointer" onClick={() => handleAction("approve", row._id)}>
                                        <span className="w-full text-center">Approve</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="bg-[#135E9A] text-white hover:bg-[#135E9A] focus:bg-[#135E9A] justify-center focus:text-white rounded-[20px] cursor-pointer" onClick={() => handleAction("hide", row._id)}>
                                        <span className="w-full text-center">Hide / Hold</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PropertyManagement;
