// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import PageHeader from "@/components/PageHeader";
// import { useAppSelector } from "@/redux/hooks";
// import { currentUser } from "@/redux/features/auth/authSlice";
// import { useGetMyPaymentsQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";
// import Link from "next/link";
// import { useGetTotalUnreadCountQuery } from "@/redux/features/messages/messageApi";
// import { RatingType, useCreateRatingMutation } from "@/redux/features/rating/ratingApi";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Star } from "lucide-react";
// import Swal from "sweetalert2";

// const Guest = () => {
//     const mainuser = useAppSelector(currentUser);
//     const [page, setPage] = useState(1);
//     const limit = 3;
//     const { data: mypayments, isLoading: paymentsLoading } = useGetMyPaymentsQuery({ page, limit });
//     const { data: unreadResponse, refetch } = useGetTotalUnreadCountQuery();
//     const totalUnreadCount = unreadResponse?.data?.totalUnreadCount || 0;

//     // Rating modal state
//     const [showRatingModal, setShowRatingModal] = useState(false);
//     const [selectedProperty, setSelectedProperty] = useState<any>(null);
//     const [ratingData, setRatingData] = useState({
//         communication: 0,
//         accuracy: 0,
//         cleanliness: 0,
//         checkInExperience: 0,
//         overallExperience: 0,
//         description: "",
//     });
//     const [createRating, { isLoading: isSubmittingRating }] = useCreateRatingMutation();

//     const handleNextPage = () => {
//         if (mypayments?.meta) {
//             const totalPages = Math.ceil(mypayments.meta.total / limit);
//             if (page < totalPages) {
//                 setPage((prev) => prev + 1);
//             }
//         }
//     };

//     const handlePrevPage = () => {
//         if (page > 1) {
//             setPage((prev) => prev - 1);
//         }
//     };

//     // Open rating modal
//     const handleRateNow = (property: any) => {
//         setSelectedProperty(property);
//         setRatingData({
//             communication: 0,
//             accuracy: 0,
//             cleanliness: 0,
//             checkInExperience: 0,
//             overallExperience: 0,
//             description: "",
//         });
//         setShowRatingModal(true);
//     };

//     // Close rating modal
//     const handleCloseModal = () => {
//         setShowRatingModal(false);
//         setSelectedProperty(null);
//     };

//     // Handle star rating change
//     const handleStarChange = (category: string, value: number) => {
//         setRatingData((prev) => ({
//             ...prev,
//             [category]: value,
//         }));
//     };

//     // Handle text input change
//     const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setRatingData((prev) => ({
//             ...prev,
//             description: e.target.value,
//         }));
//     };

//     // Submit rating

//     const handleSubmitRating = async () => {
//         if (!selectedProperty || ratingData.overallExperience === 0) {
//             await Swal.fire({
//                 title: "Warning!",
//                 text: "Please provide an overall rating before submitting.",
//                 icon: "warning",
//                 iconColor: "#C9A94D",
//                 background: "#2D3546",
//                 color: "#F5F5F5",
//                 confirmButtonColor: "#C9A94D",
//                 confirmButtonText: "OK",
//                 customClass: {
//                     popup: "z-[99999]",
//                 },
//             });
//             return;
//         }

//         try {
//             const ratingPayload = {
//                 type: RatingType.PROPERTY,
//                 propertyId: selectedProperty.propertyId?._id,
//                 hostId: selectedProperty.hostId?._id,
//                 ...ratingData,
//                 description: ratingData.description || undefined,
//             };

//             await createRating(ratingPayload).unwrap();

//             // ✅ Close the modal first
//             handleCloseModal();

//             // ✅ Wait a short delay to ensure modal DOM unmounts fully
//             setTimeout(async () => {
//                 await Swal.fire({
//                     title: "Success!",
//                     text: "Rating submitted successfully!",
//                     icon: "success",
//                     iconColor: "#C9A94D",
//                     background: "#2D3546",
//                     color: "#F5F5F5",
//                     confirmButtonColor: "#C9A94D",
//                     confirmButtonText: "OK",
//                     allowOutsideClick: true,
//                     allowEscapeKey: true,
//                     customClass: {
//                         popup: "z-[99999]",
//                         container: "swal-fix-layer",
//                     },
//                 });
//             }, 400);
//         } catch (error) {
//             console.log("Error submitting rating:", error);
//             handleCloseModal();

//             setTimeout(async () => {
//                 await Swal.fire({
//                     title: "Error!",
//                     text: "Failed to submit rating. Please try again.",
//                     icon: "error",
//                     iconColor: "#D00000",
//                     background: "#2D3546",
//                     color: "#F5F5F5",
//                     confirmButtonColor: "#D00000",
//                     confirmButtonText: "Try Again",
//                     allowOutsideClick: true,
//                     allowEscapeKey: true,
//                     customClass: {
//                         popup: "z-[99999]",
//                         container: "swal-fix-layer",
//                     },
//                 });
//             }, 400);
//         }
//     };

//     // Star Rating Component
//     const StarRating = ({ category, value, onChange }: { category: string; value: number; onChange: (category: string, value: number) => void }) => (
//         <div className="flex items-center justify-between mb-4">
//             <label className="text-white capitalize min-w-[150px]">{category.replace(/([A-Z])/g, " $1").trim()}:</label>
//             <div className="flex gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <button key={star} type="button" onClick={() => onChange(category, star)} className={`text-2xl ${star <= value ? "text-yellow-400" : "text-gray-400"} hover:text-yellow-300 transition-colors`}>
//                         ★
//                     </button>
//                 ))}
//             </div>
//             <span className="text-white ml-2 min-w-[20px]">{value}/5</span>
//         </div>
//     );

//     return (
//         <div>
//             <PageHeader title={"Guest Dashboard"}></PageHeader>

//             {/* Rating Modal */}

//             {showRatingModal && selectedProperty && (
//                 <Dialog open={showRatingModal} onOpenChange={handleCloseModal}>
//                     <DialogContent className="bg-[#14213D] border-[#C9A94D] text-white md:max-w-md md:w-full max-h-[90vh] overflow-y-auto">
//                         <DialogHeader>
//                             <DialogTitle className="text-[#C9A94D] text-xl text-center">Review Your Host</DialogTitle>
//                             <div className="text-center mt-2">
//                                 <h3 className="text-white font-semibold mb-1 text-base">{selectedProperty.propertyId?.title}</h3>
//                                 <p className="text-gray-300 text-sm">
//                                     {selectedProperty.messageId?.checkInDate ? new Date(selectedProperty.messageId.checkInDate).toLocaleDateString() : "N/A"} - {selectedProperty.messageId?.checkOutDate ? new Date(selectedProperty.messageId.checkOutDate).toLocaleDateString() : "N/A"}
//                                 </p>
//                             </div>
//                         </DialogHeader>

//                         <div className="space-y-4 mt-2">
//                             {/* Communication */}
//                             <div className="flex items-center justify-between">
//                                 <p className="text-white">Communication</p>
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex gap-1">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("communication", star)}>
//                                                 <Star className={`w-6 h-6 ${star <= ratingData.communication ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
//                                             </button>
//                                         ))}
//                                     </div>
//                                     <span className="text-white text-sm min-w-[30px]">{ratingData.communication === 0 ? "0/5" : `${ratingData.communication}/5`}</span>
//                                 </div>
//                             </div>

//                             {/* Accuracy */}
//                             <div className="flex items-center justify-between">
//                                 <p className="text-white">Accuracy of Listing</p>
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex gap-1">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("accuracy", star)}>
//                                                 <Star className={`w-6 h-6 ${star <= ratingData.accuracy ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
//                                             </button>
//                                         ))}
//                                     </div>
//                                     <span className="text-white text-sm min-w-[30px]">{ratingData.accuracy === 0 ? "0/5" : `${ratingData.accuracy}/5`}</span>
//                                 </div>
//                             </div>

//                             {/* Cleanliness */}
//                             <div className="flex items-center justify-between">
//                                 <p className="text-white">Cleanliness</p>
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex gap-1">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("cleanliness", star)}>
//                                                 <Star className={`w-6 h-6 ${star <= ratingData.cleanliness ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
//                                             </button>
//                                         ))}
//                                     </div>
//                                     <span className="text-white text-sm min-w-[30px]">{ratingData.cleanliness === 0 ? "0/5" : `${ratingData.cleanliness}/5`}</span>
//                                 </div>
//                             </div>

//                             {/* Check-in Experience */}
//                             <div className="flex items-center justify-between">
//                                 <p className="text-white">Check-In Experience</p>
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex gap-1">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("checkInExperience", star)}>
//                                                 <Star className={`w-6 h-6 ${star <= ratingData.checkInExperience ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
//                                             </button>
//                                         ))}
//                                     </div>
//                                     <span className="text-white text-sm min-w-[30px]">{ratingData.checkInExperience === 0 ? "0/5" : `${ratingData.checkInExperience}/5`}</span>
//                                 </div>
//                             </div>

//                             {/* Overall Experience - At the bottom */}
//                             <div className="flex items-center justify-between">
//                                 <p className="text-white">Overall Experience:</p>
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex gap-1">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("overallExperience", star)}>
//                                                 <Star className={`w-6 h-6 ${star <= ratingData.overallExperience ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
//                                             </button>
//                                         ))}
//                                     </div>
//                                     <span className="text-white text-sm min-w-[30px]">{ratingData.overallExperience === 0 ? "0/5" : `${ratingData.overallExperience}/5`}</span>
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
//                                     Description
//                                 </label>
//                                 <textarea
//                                     id="description"
//                                     value={ratingData.description}
//                                     onChange={handleInputChange}
//                                     placeholder="e.g - Relax and unwind in our bright, comfortable apartment, perfect for families, couples, or solo travellers. Enjoy two bedrooms, a fully equipped kitchen for your short stay!"
//                                     rows={4}
//                                     className="w-full text-white placeholder-gray-400 px-3 py-2 border border-[#C9A94D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent resize-none bg-[#1a202c]"
//                                     maxLength={500}
//                                 />
//                                 <p className="text-xs text-gray-400 mt-1">{ratingData.description.length}/500 characters</p>
//                             </div>

//                             {/* Submit Button */}
//                             <Button onClick={handleSubmitRating} disabled={isSubmittingRating || ratingData.overallExperience === 0} className="w-full bg-[#C9A94D] hover:bg-[#af8d28] text-white disabled:opacity-50 disabled:cursor-not-allowed">
//                                 {isSubmittingRating ? (
//                                     <div className="flex items-center justify-center gap-2">
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                         Submitting...
//                                     </div>
//                                 ) : (
//                                     "Submit Review"
//                                 )}
//                             </Button>

//                             {/* User Info */}
//                             {mainuser && (
//                                 <p className="text-xs text-gray-400 text-center">
//                                     Reviewing as: {mainuser.name} ({mainuser.email})
//                                 </p>
//                             )}
//                         </div>
//                     </DialogContent>
//                 </Dialog>
//             )}

//             <div className="text-[#C9A94D]">
//                 <div className="mb-8">
//                     <h1 className="font-bold text-[30px] mb-4">Guest Dashboard</h1>
//                     <p>Welcome back, {mainuser?.name} ! Here's what's happening with your account.</p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 mb-8">
//                     <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
//                         <Image src="/dashboard/sidebar/calendar.png" alt="Total Booking" width={35} height={35}></Image>
//                         <div>
//                             <p>Total Booking</p>
//                             <h1 className="text-xl font-bold text-center md:text-left">{mypayments?.meta?.total ?? 0}</h1>
//                         </div>
//                     </div>
//                     <Link href="/messages">
//                         <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
//                             <Image src="/dashboard/sidebar/message.png" alt="Total Booking" width={35} height={35}></Image>
//                             <div>
//                                 <p>Messages</p>
//                                 <h1 className="text-xl font-bold text-center md:text-left">{totalUnreadCount}</h1>
//                             </div>
//                         </div>
//                     </Link>
//                 </div>

//                 <div className="gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
//                     <h1 className="text-[24px] mb-6">Your Bookings</h1>

//                     {paymentsLoading ? (
//                         <div className="text-center py-8">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
//                             <p className="mt-4 text-[#C9A94D]">Loading bookings...</p>
//                         </div>
//                     ) : mypayments?.success === false ? (
//                         <div className="text-center py-8">
//                             <div className="text-red-500 text-lg mb-2">Failed to load bookings</div>
//                             <p className="text-[#C9A94D]">{mypayments?.message || "Please try again later"}</p>
//                         </div>
//                     ) : !mypayments?.data || mypayments.data.length === 0 ? (
//                         <div className="text-center py-8">
//                             <p className="text-[#C9A94D] text-lg">No bookings found</p>
//                         </div>
//                     ) : (
//                         <>
//                             {mypayments.data.map((payment: any) => {
//                                 const isExpired = new Date(payment.messageId?.checkOutDate) > new Date();

//                                 return (
//                                     <div key={payment._id} className="flex items-center justify-between flex-col md:flex-row gap-4 p-2 border border-[#C9A94D] rounded-[10px] mb-6">
//                                         <div className="flex items-center gap-5 flex-col md:flex-row">
//                                             <Image src={payment.propertyId?.coverPhoto ? `${process.env.NEXT_PUBLIC_BASE_API}${payment.propertyId.coverPhoto}` : "/dashboard/booking.png"} alt="Booking Img" height={80} width={100} />
//                                             <div>
//                                                 <h1 className="font-bold text-xl text-white">{payment.propertyId?.title}</h1>
//                                                 <p className="text-gray-300">
//                                                     {payment.messageId?.checkInDate ? new Date(payment.messageId.checkInDate).toLocaleDateString() : "N/A"} - {payment.messageId?.checkOutDate ? new Date(payment.messageId.checkOutDate).toLocaleDateString() : "N/A"}
//                                                 </p>
//                                                 <p className="text-[#C9A94D]">£{payment.totalAmount}</p>
//                                             </div>
//                                         </div>
//                                         <div className={isExpired ? "flex flex-col gap-2" : "flex flex-col gap-2"}>
//                                             <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">{isExpired ? "Previously Booked" : "Confirmed"}</button>
//                                             {isExpired && (
//                                                 <Link href={`/listings/${payment.propertyId?._id}`}>
//                                                     <button className="font-bold bg-white text-black px-2 rounded-[10px] w-full">Book Again</button>
//                                                 </Link>
//                                             )}
//                                             <button onClick={() => handleRateNow(payment)} className="w-full bg-[#C9A94D] text-white rounded-[10px] px-2 hover:bg-[#b8973e] transition-colors">
//                                                 Rate Now
//                                             </button>
//                                         </div>
//                                     </div>
//                                 );
//                             })}

//                             {/* Pagination Controls */}
//                             {mypayments?.meta && mypayments.meta.total > 0 && (
//                                 <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] gap-4">
//                                     <div className="text-[#C9A94D] text-sm">
//                                         Showing {(page - 1) * limit + 1} to {Math.min(page * limit, mypayments.meta.total)} of {mypayments.meta.total} properties
//                                     </div>
//                                     <div className="flex gap-2">
//                                         <button onClick={handlePrevPage} disabled={page === 1} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//                                             Previous
//                                         </button>
//                                         <span className="px-3 py-1 text-[#C9A94D]">
//                                             Page {page} of {Math.ceil(mypayments.meta.total / limit)}
//                                         </span>
//                                         <button onClick={handleNextPage} disabled={page >= Math.ceil(mypayments.meta.total / limit)} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//                                             Next
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Guest;

"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetMyPaymentsQuery } from "@/redux/features/propertyPayment/propertyPaymentApi";
import Link from "next/link";
import { useGetTotalUnreadCountQuery } from "@/redux/features/messages/messageApi";
import { RatingType, useCreateRatingMutation, useCheckUserPropertiesRatingMutation } from "@/redux/features/rating/ratingApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Swal from "sweetalert2";

const Guest = () => {
    const mainuser = useAppSelector(currentUser);
    const [page, setPage] = useState(1);
    const limit = 3;
    const { data: mypayments, isLoading: paymentsLoading } = useGetMyPaymentsQuery({ page, limit });
    const { data: unreadResponse, refetch } = useGetTotalUnreadCountQuery();
    const totalUnreadCount = unreadResponse?.data?.totalUnreadCount || 0;

    // Rating modal state
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [ratingData, setRatingData] = useState({
        communication: 0,
        accuracy: 0,
        cleanliness: 0,
        checkInExperience: 0,
        overallExperience: 0,
        description: "",
    });
    const [createRating, { isLoading: isSubmittingRating }] = useCreateRatingMutation();

    // Check user ratings for properties
    const [checkUserPropertiesRating, { data: ratingsData, isLoading: ratingsLoading }] = useCheckUserPropertiesRatingMutation();

    useEffect(() => {
        if (mypayments?.data) {
            // Filter out properties without IDs
            const propertyIds = mypayments.data.map((payment: any) => payment.propertyId?._id).filter(Boolean) as string[];

            if (propertyIds.length > 0) {
                checkUserPropertiesRating({
                    propertyIds,
                });
            }
        }
    }, [mypayments?.data, checkUserPropertiesRating]);

    // Create rating map
    const ratingsMap = useMemo(() => {
        const map: { [key: string]: boolean } = {};
        if (ratingsData?.data) {
            ratingsData.data.forEach((item: any) => {
                map[item.propertyId] = item.hasRated;
            });
        }
        return map;
    }, [ratingsData]);

    const handleNextPage = () => {
        if (mypayments?.meta) {
            const totalPages = Math.ceil(mypayments.meta.total / limit);
            if (page < totalPages) {
                setPage((prev) => prev + 1);
            }
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    // Open rating modal
    const handleRateNow = (property: any) => {
        setSelectedProperty(property);
        setRatingData({
            communication: 0,
            accuracy: 0,
            cleanliness: 0,
            checkInExperience: 0,
            overallExperience: 0,
            description: "",
        });
        setShowRatingModal(true);
    };

    // Close rating modal
    const handleCloseModal = () => {
        setShowRatingModal(false);
        setSelectedProperty(null);
    };

    // Handle star rating change
    const handleStarChange = (category: string, value: number) => {
        setRatingData((prev) => ({
            ...prev,
            [category]: value,
        }));
    };

    // Handle text input change
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRatingData((prev) => ({
            ...prev,
            description: e.target.value,
        }));
    };

    // Submit rating
    const handleSubmitRating = async () => {
        if (!selectedProperty || ratingData.overallExperience === 0) {
            await Swal.fire({
                title: "Warning!",
                text: "Please provide an overall rating before submitting.",
                icon: "warning",
                iconColor: "#C9A94D",
                background: "#2D3546",
                color: "#F5F5F5",
                confirmButtonColor: "#C9A94D",
                confirmButtonText: "OK",
                customClass: {
                    popup: "z-[99999]",
                },
            });
            return;
        }

        try {
            const ratingPayload = {
                type: RatingType.PROPERTY,
                propertyId: selectedProperty.propertyId?._id,
                hostId: selectedProperty.hostId?._id,
                ...ratingData,
                description: ratingData.description || undefined,
            };

            await createRating(ratingPayload).unwrap();

            if (mypayments?.data) {
                const propertyIds = mypayments.data.map((payment: any) => payment.propertyId?._id).filter(Boolean) as string[];

                if (propertyIds.length > 0) {
                    checkUserPropertiesRating({
                        propertyIds,
                    });
                }
            }

            // ✅ Close the modal first
            handleCloseModal();

            // ✅ Wait a short delay to ensure modal DOM unmounts fully
            setTimeout(async () => {
                await Swal.fire({
                    title: "Success!",
                    text: "Rating submitted successfully!",
                    icon: "success",
                    iconColor: "#C9A94D",
                    background: "#2D3546",
                    color: "#F5F5F5",
                    confirmButtonColor: "#C9A94D",
                    confirmButtonText: "OK",
                    allowOutsideClick: true,
                    allowEscapeKey: true,
                    customClass: {
                        popup: "z-[99999]",
                        container: "swal-fix-layer",
                    },
                });
            }, 400);
        } catch (error) {
            console.log("Error submitting rating:", error);
            handleCloseModal();

            setTimeout(async () => {
                await Swal.fire({
                    title: "Error!",
                    text: "Failed to submit rating. Please try again.",
                    icon: "error",
                    iconColor: "#D00000",
                    background: "#2D3546",
                    color: "#F5F5F5",
                    confirmButtonColor: "#D00000",
                    confirmButtonText: "Try Again",
                    allowOutsideClick: true,
                    allowEscapeKey: true,
                    customClass: {
                        popup: "z-[99999]",
                        container: "swal-fix-layer",
                    },
                });
            }, 400);
        }
    };

    const getValidationErrors = () => {
        const errors: string[] = [];

        if (ratingData.communication === 0) errors.push("Communication rating");
        if (ratingData.accuracy === 0) errors.push("Accuracy rating");
        if (ratingData.cleanliness === 0) errors.push("Cleanliness rating");
        if (ratingData.checkInExperience === 0) errors.push("Check-in experience rating");
        if (ratingData.overallExperience === 0) errors.push("Overall experience rating");
        if (ratingData.description.length < 10) errors.push("Description (minimum 10 characters)");

        return errors;
    };

    const validationErrors = getValidationErrors();
    const isFormValid = validationErrors.length === 0;

    return (
        <div>
            <PageHeader title={"Guest Dashboard"}></PageHeader>

            {/* Rating Modal */}
            {showRatingModal && selectedProperty && (
                <Dialog open={showRatingModal} onOpenChange={handleCloseModal}>
                    <DialogContent className="bg-[#14213D] border-[#C9A94D] text-white md:max-w-md md:w-full max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-[#C9A94D] text-xl text-center">Review Your Host</DialogTitle>
                            <div className="text-center mt-2">
                                <h3 className="text-white font-semibold mb-1 text-base">{selectedProperty.propertyId?.title}</h3>
                                <p className="text-gray-300 text-sm">
                                    {selectedProperty.messageId?.checkInDate ? new Date(selectedProperty.messageId.checkInDate).toLocaleDateString() : "N/A"} - {selectedProperty.messageId?.checkOutDate ? new Date(selectedProperty.messageId.checkOutDate).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4 mt-2">
                            {/* Communication */}
                            <div className="flex items-center justify-between">
                                <p className="text-white">Communication</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("communication", star)}>
                                                <Star className={`w-6 h-6 ${star <= ratingData.communication ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-white text-sm min-w-[30px]">{ratingData.communication === 0 ? "0/5" : `${ratingData.communication}/5`}</span>
                                </div>
                            </div>

                            {/* Accuracy */}
                            <div className="flex items-center justify-between">
                                <p className="text-white">Accuracy of Listing</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("accuracy", star)}>
                                                <Star className={`w-6 h-6 ${star <= ratingData.accuracy ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-white text-sm min-w-[30px]">{ratingData.accuracy === 0 ? "0/5" : `${ratingData.accuracy}/5`}</span>
                                </div>
                            </div>

                            {/* Cleanliness */}
                            <div className="flex items-center justify-between">
                                <p className="text-white">Cleanliness</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("cleanliness", star)}>
                                                <Star className={`w-6 h-6 ${star <= ratingData.cleanliness ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-white text-sm min-w-[30px]">{ratingData.cleanliness === 0 ? "0/5" : `${ratingData.cleanliness}/5`}</span>
                                </div>
                            </div>

                            {/* Check-in Experience */}
                            <div className="flex items-center justify-between">
                                <p className="text-white">Check-In Experience</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("checkInExperience", star)}>
                                                <Star className={`w-6 h-6 ${star <= ratingData.checkInExperience ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-white text-sm min-w-[30px]">{ratingData.checkInExperience === 0 ? "0/5" : `${ratingData.checkInExperience}/5`}</span>
                                </div>
                            </div>

                            {/* Overall Experience - At the bottom */}
                            <div className="flex items-center justify-between">
                                <p className="text-white">Overall Experience:</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" className="text-xl" onClick={() => handleStarChange("overallExperience", star)}>
                                                <Star className={`w-6 h-6 ${star <= ratingData.overallExperience ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-white text-sm min-w-[30px]">{ratingData.overallExperience === 0 ? "0/5" : `${ratingData.overallExperience}/5`}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={ratingData.description}
                                    onChange={handleInputChange}
                                    placeholder="e.g - Relax and unwind in our bright, comfortable apartment, perfect for families, couples, or solo travellers. Enjoy two bedrooms, a fully equipped kitchen for your short stay!"
                                    rows={4}
                                    className="w-full text-white placeholder-gray-400 px-3 py-2 border border-[#C9A94D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent resize-none bg-[#1a202c]"
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-400 mt-1">{ratingData.description.length}/500 characters</p>
                            </div>

                            {/* Optional: Show validation errors */}
                            {/* {!isFormValid && <p className="text-red-400 text-sm text-center">Please provide all star ratings before submitting</p>} */}

                            {/* Submit Button */}
                            <Button onClick={handleSubmitRating} disabled={isSubmittingRating || !isFormValid} className="w-full bg-[#C9A94D] hover:bg-[#af8d28] text-white disabled:opacity-50 disabled:cursor-not-allowed" title={!isFormValid ? `Please provide: ${validationErrors.join(", ")}` : undefined}>
                                {isSubmittingRating ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    "Submit Review"
                                )}
                            </Button>

                            {/* User Info */}
                            {mainuser && (
                                <p className="text-xs text-gray-400 text-center">
                                    Reviewing as: {mainuser.name} ({mainuser.email})
                                </p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            <div className="text-[#C9A94D]">
                <div className="mb-8">
                    <h1 className="font-bold text-[30px] mb-4">Guest Dashboard</h1>
                    <p>Welcome back, {mainuser?.name} ! Here's what's happening with your account.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 mb-8">
                    <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                        <Image src="/dashboard/sidebar/calendar.png" alt="Total Booking" width={35} height={35}></Image>
                        <div>
                            <p>Total Booking</p>
                            <h1 className="text-xl font-bold text-center md:text-left">{mypayments?.meta?.total ?? 0}</h1>
                        </div>
                    </div>
                    <Link href="/messages">
                        <div className="flex items-center gap-5 flex-col md:flex-row border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                            <Image src="/dashboard/sidebar/message.png" alt="Total Booking" width={35} height={35}></Image>
                            <div>
                                <p>Messages</p>
                                <h1 className="text-xl font-bold text-center md:text-left">{totalUnreadCount}</h1>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="gap-5 border border-[#C9A94D] bg-[#2D3546] rounded-2xl p-5">
                    <h1 className="text-[24px] mb-6">Your Bookings</h1>

                    {paymentsLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                            <p className="mt-4 text-[#C9A94D]">Loading bookings...</p>
                        </div>
                    ) : mypayments?.success === false ? (
                        <div className="text-center py-8">
                            <div className="text-red-500 text-lg mb-2">Failed to load bookings</div>
                            <p className="text-[#C9A94D]">{mypayments?.message || "Please try again later"}</p>
                        </div>
                    ) : !mypayments?.data || mypayments.data.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-[#C9A94D] text-lg">No bookings found</p>
                        </div>
                    ) : (
                        <>
                            {mypayments.data.map((payment: any) => {
                                const isExpired = new Date(payment.messageId?.checkOutDate) > new Date();
                                const propertyId = payment.propertyId?._id;
                                const hasRated = propertyId ? ratingsMap[propertyId] || false : false;

                                return (
                                    <div key={payment._id} className="flex items-center justify-between flex-col md:flex-row gap-4 p-2 border border-[#C9A94D] rounded-[10px] mb-6">
                                        <div className="flex items-center gap-5 flex-col md:flex-row">
                                            <Image src={payment.propertyId?.coverPhoto ? `${process.env.NEXT_PUBLIC_BASE_API}${payment.propertyId.coverPhoto}` : "/dashboard/booking.png"} alt="Booking Img" height={80} width={100} />
                                            <div>
                                                <h1 className="font-bold text-xl text-white">{payment.propertyId?.title}</h1>
                                                <p className="text-gray-300">
                                                    {payment.messageId?.checkInDate ? new Date(payment.messageId.checkInDate).toLocaleDateString() : "N/A"} - {payment.messageId?.checkOutDate ? new Date(payment.messageId.checkOutDate).toLocaleDateString() : "N/A"}
                                                </p>
                                                <p className="text-[#C9A94D]">£{payment.totalAmount}</p>
                                            </div>
                                        </div>
                                        <div className={isExpired ? "flex flex-col gap-2" : "flex flex-col gap-2"}>
                                            <button className="font-bold bg-[#C9A94D] text-white px-2 rounded-[10px] w-full">{isExpired ? "Previously Booked" : "Confirmed"}</button>
                                            {isExpired && (
                                                <Link href={`/listings/${payment.propertyId?._id}`}>
                                                    <button className="font-bold bg-white text-black px-2 rounded-[10px] w-full">Book Again</button>
                                                </Link>
                                            )}
                                            {/* Conditionally show Rate Now button */}
                                            {!hasRated && (
                                                <button onClick={() => handleRateNow(payment)} className="w-full bg-[#C9A94D] text-white rounded-[10px] px-2 hover:bg-[#b8973e] transition-colors">
                                                    Rate Now
                                                </button>
                                            )}
                                            {/* Show Already Rated if user has rated */}
                                            {hasRated && (
                                                <button disabled className="w-full bg-gray-600 text-gray-400 rounded-[10px] px-2 cursor-not-allowed">
                                                    Already Rated
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Pagination Controls */}
                            {mypayments?.meta && mypayments.meta.total > 0 && (
                                <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-[#C9A94D] gap-4">
                                    <div className="text-[#C9A94D] text-sm">
                                        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, mypayments.meta.total)} of {mypayments.meta.total} properties
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handlePrevPage} disabled={page === 1} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            Previous
                                        </button>
                                        <span className="px-3 py-1 text-[#C9A94D]">
                                            Page {page} of {Math.ceil(mypayments.meta.total / limit)}
                                        </span>
                                        <button onClick={handleNextPage} disabled={page >= Math.ceil(mypayments.meta.total / limit)} className="px-3 py-1 border border-[#C9A94D] text-[#C9A94D] rounded hover:bg-[#C9A94D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Guest;
