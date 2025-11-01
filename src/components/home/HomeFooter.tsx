"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetUserSiteRatingQuery, useCreateRatingMutation } from "@/redux/features/rating/ratingApi";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/features/auth/authSlice";

// Add RatingType enum if not imported
enum RatingType {
    PROPERTY = "property",
    SITE = "site",
}

interface FormErrors {
    rating?: string;
    country?: string;
    description?: string;
}

const HomeFooter = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const user = useSelector(currentUser);

    const {
        data: userSiteRating,
        refetch,
        isLoading: isRatingLoading,
        error: ratingError,
    } = useGetUserSiteRatingQuery(undefined, {
        skip: !user,
    });

    // Fix the hasRatedSite logic
    const hasRatedSite = userSiteRating?.success && userSiteRating?.data !== null && userSiteRating?.data !== undefined;

    const [createRating] = useCreateRatingMutation();

    useEffect(() => {
        if (user && isDialogOpen) {
            refetch();
        }
    }, [user, isDialogOpen, refetch]);

    // Clear errors when user starts typing
    useEffect(() => {
        if (rating > 0) {
            setErrors((prev) => ({ ...prev, rating: undefined }));
        }
    }, [rating]);

    useEffect(() => {
        if (country.trim()) {
            setErrors((prev) => ({ ...prev, country: undefined }));
        }
    }, [country]);

    useEffect(() => {
        if (description.trim()) {
            setErrors((prev) => ({ ...prev, description: undefined }));
        }
    }, [description]);

    const handleStarClick = (value: number) => {
        setRating(value);
        setErrors((prev) => ({ ...prev, rating: undefined }));
    };

    const handleStarHover = (value: number) => {
        setHoverRating(value);
    };

    const handleStarLeave = () => {
        setHoverRating(0);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (rating === 0) {
            newErrors.rating = "Please select a rating";
        }

        if (!country.trim()) {
            newErrors.country = "Country is required";
        }

        // ADDED: Make description required
        if (!description.trim()) {
            newErrors.description = "Feedback is required";
        }

        // ADDED: Minimum length validation for description
        if (description.trim().length < 10) {
            newErrors.description = "Feedback must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitRating = async () => {
        if (!user) {
            setIsDialogOpen(false);
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createRating({
                type: RatingType.SITE,
                overallExperience: rating,
                country: country.trim(),
                description: description.trim(),
            }).unwrap();

            console.log("Rating submitted successfully:", result);

            setIsDialogOpen(false);
            setRating(0);
            setDescription("");
            setCountry("");
            setErrors({});

            // Refetch to update the hasRatedSite status
            refetch();
        } catch (error: any) {
            console.error("Failed to submit rating:", error);
            // Handle API errors
            if (error.data?.message) {
                setErrors({ rating: error.data.message });
            } else {
                setErrors({ rating: "Failed to submit rating. Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRateSiteClick = () => {
        if (!user) {
            // You can show a login modal here instead of alert
            return;
        }
        setIsDialogOpen(true);
    };

    // Show loading state while checking rating status
    if (isRatingLoading) {
        return (
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 py-6 md:py-10">
                        <div>Loading ratings...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="mx-4 md:mx-0">
                <div className={`grid gap-4 py-6 md:py-10 ${!user || user?.role !== "GUEST" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}>
                    <div>
                        <h1 className="text-xl md:text-[24px] text-[#C9A94D] mb-2 uppercase font-bold">LETANEST</h1>
                        <p className="text-[14px] md:text-[18px] text-[#C9A94D]">Your trusted platform for unique accommodations worldwide.</p>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-[24px] text-[#C9A94D] mb-2 uppercase font-bold">For Guests</h1>
                        <ul className="list-disc list-inside text-[#C9A94D] text-[14px] md:text-[18px] space-y-1">
                            <li>
                                <Link href="/listings" className="hover:underline">
                                    Search Properties
                                </Link>
                            </li>
                            <li>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild className="text-[#C9A94D]">
                                        <button onClick={handleRateSiteClick} className="hover:underline text-left" disabled={hasRatedSite}>
                                            {hasRatedSite ? "Review Submitted" : "Leave Us a Review"}
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-[#14213D] text-[#C9A94D]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-xl">{hasRatedSite ? "Update Your Rating" : "Rate Our Website"}</DialogTitle>
                                        </DialogHeader>

                                        {hasRatedSite ? (
                                            <div className="text-center py-4">
                                                <p className="mb-4">You’ve already rated our site!</p>
                                                <p className="mb-4">Thank you for your feedback — you gave us {userSiteRating?.data?.overallExperience} stars.</p>
                                                <Button onClick={() => setIsDialogOpen(false)} className="bg-[#C9A94D] hover:bg-[#af8d28] text-white">
                                                    Close
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {/* Rating Stars */}
                                                <div className="text-center">
                                                    <p className=" mb-3">How would you rate your experience? *</p>
                                                    <div className="flex justify-center gap-1">
                                                        {/* {[1, 2, 3, 4, 5].map((star) => (
                                                            <button key={star} type="button" className={`text-2xl ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"} transition-colors`} onClick={() => handleStarClick(star)} onMouseEnter={() => handleStarHover(star)} onMouseLeave={handleStarLeave}>
                                                                <Star className="w-8 h-8 fill-current" />
                                                            </button>
                                                        ))} */}
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button key={star} type="button" className="text-2xl" onClick={() => handleStarClick(star)} onMouseEnter={() => handleStarHover(star)} onMouseLeave={handleStarLeave}>
                                                                <Star className={`w-8 h-8 ${star <= (hoverRating || rating) ? "fill-[#C9A94D] text-[#C9A94D]" : "fill-none text-gray-300 stroke-[#C9A94D] stroke-2"}`} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <p className="text-sm  mt-2">{rating === 0 ? "Select a rating" : `${rating} star${rating > 1 ? "s" : ""}`}</p>
                                                    {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                                                </div>

                                                {/* Country Input */}
                                                <div>
                                                    <label htmlFor="country" className="block text-sm font-medium  mb-1">
                                                        Your Country *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="country"
                                                        value={country}
                                                        onChange={(e) => setCountry(e.target.value)}
                                                        placeholder="Enter your country"
                                                        className={`w-full px-3 py-2 border border-[#C9A94D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A94D] text-[#C9A94D] placeholder:text-[#C9A94D] focus:border-transparent ${errors.country ? "border-red-500" : "border-[#C9A94D]"}`}
                                                    />
                                                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                                </div>

                                                {/* Description Input - NOW REQUIRED */}
                                                <div>
                                                    <label htmlFor="description" className="block text-sm font-medium  mb-1">
                                                        Your Feedback *
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        placeholder="Share your experience with us (minimum 10 characters)..."
                                                        rows={3}
                                                        className={`w-full text-[#C9A94D] placeholder:text-[#C9A94D] px-3 py-2 border border-[#C9A94D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent resize-none ${errors.description ? "border-red-500" : "border-[#C9A94D]"}`}
                                                    />
                                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                                    <p className="text-xs  mt-1">{description.length}/10 characters minimum</p>
                                                </div>

                                                {/* Submit Button */}
                                                <Button onClick={handleSubmitRating} disabled={isSubmitting} className="w-full bg-[#C9A94D] hover:bg-[#af8d28] text-white">
                                                    {isSubmitting ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                                                            Submitting...
                                                        </div>
                                                    ) : (
                                                        "Submit Rating"
                                                    )}
                                                </Button>

                                                {/* User Info */}
                                                {user && (
                                                    <p className="text-xs  text-center">
                                                        Rating as: {user.name} ({user.email})
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:underline">
                                    Get Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Rest of your footer code remains the same */}
                    {(!user || user?.role !== "GUEST") && (
                        <div>
                            <h1 className="text-xl md:text-[24px] text-[#C9A94D] mb-2 uppercase font-bold">For Hosts</h1>
                            <ul className="list-disc list-inside text-[#C9A94D] text-[14px] md:text-[18px] space-y-1">
                                <li>
                                    <Link href="/dashboard/property-management" className="hover:underline">
                                        List Property
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard" className="hover:underline">
                                        Manage Bookings
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/memberships" className="hover:underline">
                                        Subscription Plans
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}

                    <div>
                        <h1 className="text-xl md:text-[24px] text-[#C9A94D] mb-2 uppercase font-bold">Company</h1>
                        <ul className="list-disc list-inside text-[#C9A94D] text-[14px] md:text-[18px] space-y-1">
                            <li>
                                <Link href="/privacy-policy" className="hover:underline">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-of-conditions" className="hover:underline">
                                    Terms of Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:underline">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeFooter;
