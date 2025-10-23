"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight, MessagesSquare } from "lucide-react";
import SingleStarRating from "@/utils/SingleStarRating";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { useGetSinglePropertyQuery } from "@/redux/features/property/propertyApi";
import { useCreateConversationMutation, useSendMessageMutation } from "@/redux/features/messages/messageApi";
import ListingIcon from "@/utils/ListingIcon";
import { useDispatch, useSelector } from "react-redux";
import { setRedirectPath, currentUser } from "@/redux/features/auth/authSlice";

export default function PropertyPage2() {
    const params = useParams();
    const { id } = params;
    const router = useRouter();
    const dispatch = useDispatch();

    const { data: response, isLoading, error } = useGetSinglePropertyQuery(id as string);
    console.log(response);
    const [createConversation] = useCreateConversationMutation();
    const [sendMessage] = useSendMessageMutation();

    const user = useSelector(currentUser);

    const [question, setQuestion] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const property = response?.data;

    const amenitiesListingIcons: Record<string, number> = {
        wifi: 1,
        parking: 2,
        "hot tub": 3,
        "towels included": 4,
        tv: 5,
        garden: 6,
        pool: 7,
        "pet friendly": 8,
        dryer: 9,
        gym: 10,
        "beach access": 11,
        "smoking allowed": 12,
        balcony: 13,
        kitchen: 14,
        "lift access": 15,
        "disability access": 16,
        "disability parking": 17,
    };

    const handleBookNow = () => {
        if (!user) {
            // Save the current path for redirect after login
            console.log("hit here");
            dispatch(setRedirectPath(`/listings/${id}`));
            setIsDialogOpen(true);
        } else {
            // User is logged in, proceed with booking chat
            handleBookingChat();
        }
    };

    const handleBookingChat = async () => {
        if (!property?.createdBy?._id || !user) {
            console.error("❌ Host information or user not available");
            return;
        }

        setIsChatLoading(true);

        try {
            console.log("🚀 Creating booking conversation...");

            // Step 1: Create the conversation
            const conversationResult = await createConversation({
                participants: [property.createdBy._id],
                propertyId: property._id,
            }).unwrap();

            console.log("✅ Conversation created:", conversationResult);

            // Check if conversation was created successfully
            if (conversationResult.success && conversationResult.data?._id) {
                const conversationId = conversationResult.data._id;

                // Step 2: Send the booking message
                console.log("📤 Sending booking message...");
                await sendMessage({
                    conversationId: conversationId,
                    sender: user._id,
                    type: "text",
                    text: `I want to book ${property.propertyNumber}`,
                }).unwrap();

                console.log("✅ Booking message sent successfully");

                // Navigate to messages page
                console.log("🔀 Redirecting to messages...");
                router.push("/messages");
            } else {
                console.error("❌ Conversation creation failed:", conversationResult.message);
            }
        } catch (error: any) {
            console.error("❌ Failed to start booking chat:", error);

            if (error?.data?.message) {
                console.error("Error details:", error.data.message);
            }
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleChatWithHost = async () => {
        if (!property?.createdBy?._id) {
            console.error("❌ Host information not available");
            return;
        }

        setIsChatLoading(true);

        try {
            const result = await createConversation({
                participants: [property.createdBy._id],
                propertyId: property._id,
            }).unwrap();

            console.log("✅ Conversation created:", result);

            router.push("/messages");
        } catch (error) {
            console.error("❌ Failed to start chat:", error);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleAskQuestion = async () => {
        if (!property?.createdBy?._id) {
            console.error("❌ Host information not available");
            return;
        }

        if (!question.trim()) {
            console.warn("⚠️ No question provided");
            return;
        }

        if (!user) {
            // Save the current path for redirect after login
            dispatch(setRedirectPath(`/listings/${id}`));
            setIsDialogOpen(true);
            return;
        }

        setIsChatLoading(true);

        try {
            console.log("🚀 Creating conversation with question...");

            // Step 1: Create the conversation
            const conversationResult = await createConversation({
                participants: [property.createdBy._id],
                propertyId: property._id,
            }).unwrap();

            console.log("✅ Conversation created:", conversationResult);

            // Check if conversation was created successfully
            if (conversationResult.success && conversationResult.data?._id) {
                const conversationId = conversationResult.data._id;

                // Step 2: Send the initial message with the question
                console.log("📤 Sending question...");
                await sendMessage({
                    conversationId: conversationId,
                    sender: user._id,
                    type: "text",
                    text: question.trim(),
                }).unwrap();

                console.log("✅ Question sent successfully");

                // Clear the textarea
                setQuestion("");

                // Navigate to messages page
                console.log("🔀 Redirecting to messages...");
                router.push("/messages");
            } else {
                console.error("❌ Conversation creation failed:", conversationResult.message);
            }
        } catch (error: any) {
            console.error("❌ Failed to send question:", error);

            if (error?.data?.message) {
                console.error("Error details:", error.data.message);
            }
        } finally {
            setIsChatLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                    <p className="mt-4 text-[#C9A94D]">Loading property...</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center py-12">
                    <p className="text-red-500">Failed to load property</p>
                </div>
            </div>
        );
    }

    // Create image array with coverPhoto first, then other photos
    const allImages = [property.coverPhoto, ...(property.photos || [])].filter(Boolean); // Remove any empty/null values

    // Get image URL helper function
    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return "/proparties/default.png";

        if (imagePath.startsWith("http")) {
            return imagePath;
        }

        return `${process.env.NEXT_PUBLIC_BASE_API || ""}${imagePath}`;
    };

    return (
        <div className="container mx-auto py-10">
            <div className="mx-4 md:mx-0">
                <div className="mb-8">
                    <div className="relative w-full">
                        {/* Fixed title & token at top */}
                        <div className="absolute bottom-6 left-6 z-10 text-white">
                            <h2 className="text-xl md:text-[40px] font-bold md:mb-4">{property.title}</h2>
                            <p className="text-[16px] md:text-2xl font-bold">#{property.propertyNumber}</p>
                        </div>

                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1}
                            navigation={{
                                prevEl: ".swiper-prev",
                                nextEl: ".swiper-next",
                            }}
                            loop={true}
                            allowTouchMove={false}
                        >
                            {allImages.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="relative w-full h-64 md:h-[600px] rounded-lg overflow-hidden">
                                        <Image
                                            src={getImageUrl(img)}
                                            alt={property.title}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                console.log("Image failed to load:", img);
                                                (e.target as HTMLImageElement).src = "/proparties/default.png";
                                            }}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-2">
                        <button className="swiper-prev flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                            <ArrowLeft />
                        </button>

                        <button className="swiper-next flex items-center justify-center bg-[#C9A94D] border border-[#C9A94D] rounded-full h-12 w-12 hover:bg-transparent hover:text-[#C9A94D]">
                            <ArrowRight />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-6/8 p-2 md:p-5 ">
                        <div className="flex gap-4 items-start mb-6 flex-col md:flex-row">
                            <div className="text-white">
                                <h2 className="text-xl md:text-[40px] font-bold md:mb-4">{property.title}</h2>
                                <p className="text-[16px] md:text-2xl font-bold">#{property.propertyNumber}</p>
                            </div>
                            <div className="flex items-center gap-3 w-56">
                                <SingleStarRating rating={4} /> {/* Default rating since API might not have */}
                                <p className="text-2xl font-bold text-[#C9A94D]">4.0</p>
                                <p className="text-xl text-[#C9A94D]">(0 reviews)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mb-7 flex-col md:flex-row">
                            <div className="py-3 md:py-0 px-0 md:px-6 border-b md:border-b-0 md:border-r border-white w-full md:w-auto">
                                <Image className="mx-auto mb-3" src="/listing/guests.png" alt="Guests" height={24} width={24}></Image>
                                <p className="text-center text-white">{property.maxGuests} Guests</p>
                            </div>
                            <div className="py-3 md:py-0 px-0 md:px-6 border-b md:border-b-0 md:border-r border-white w-full md:w-auto ">
                                <Image className="mx-auto mb-3" src="/listing/beds.png" alt="Bedrooms" height={24} width={24}></Image>
                                <p className="text-center text-white">{property.bedrooms} Bedrooms</p>
                            </div>
                            <div className="py-3 md:py-0 px-0 md:px-6  w-full md:w-auto">
                                <Image className="mx-auto mb-3" src="/listing/bathrooms.png" alt="Bathrooms" height={24} width={24}></Image>
                                <p className="text-center text-white">{property.bathrooms} Bathroom</p>
                            </div>
                        </div>
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Description</h1>
                            <p className="text-[#E8E9EC]">{property.description}</p>
                        </div>
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                            <h1 className="text-[32px] text-white mb-4 font-bold">What this place offers</h1>
                            <div className="grid grid-cols-2 gap-2">
                                {property?.amenities?.map((item, idx) => {
                                    const iconId = amenitiesListingIcons[item.toLowerCase()] || 0; // fallback id

                                    return (
                                        <div key={idx} className="flex items-center gap-3 md:p-4">
                                            <div className="relative w-8 h-8 shrink-0">
                                                {/* Use ListingIcon instead of Image */}
                                                <ListingIcon id={iconId} size={24} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-[#B6BAC3] text-lg">{item}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sleeping arrangements section - using property data */}
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Where you'll sleep</h1>
                            <div className="space-y-12">
                                {/* Create sleeping arrangement from property data */}
                                <div className="flex flex-col items-center">
                                    {/* Grid of images - using all property images */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                                        {allImages.slice(0, 3).map((img, i) => (
                                            <div key={i} className="relative w-full h-32 md:h-64 rounded-lg overflow-hidden">
                                                <Image
                                                    src={getImageUrl(img)}
                                                    alt={`${property.title} image ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/proparties/default.png";
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bedroom info */}
                                    <div className="mt-4 text-center">
                                        <h3 className="text-white text-[32px]">
                                            {property.bedrooms} Bedroom{property.bedrooms !== 1 ? "s" : ""}
                                        </h3>
                                        <p className="text-[#B6BAC3] text-lg">Comfortable sleeping space</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Host section - using createdBy data */}
                        {property.createdBy && (
                            <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                                <h1 className="text-[32px] text-white mb-4 font-bold">Meet The Host</h1>
                                <div className="flex md:items-center gap-6 md:gap-12 flex-col md:flex-row">
                                    <div className="flex items-center gap-5">
                                        <Image
                                            src={property?.createdBy?.profileImg ? `${process.env.NEXT_PUBLIC_BASE_API}${property.createdBy.profileImg}` : "/listing/avatar.jpg"}
                                            alt="Host"
                                            height={100}
                                            width={100}
                                            className="object-cover w-[100px] h-[100px] rounded-full border border-white"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/listing/avatar.jpg";
                                            }}
                                        />
                                        <div>
                                            <p className="text-2xl text-white">{property.createdBy.name || "Host"}</p>
                                            <p className="text-white">{property.createdBy.email}</p>
                                            <div className="flex items-center gap-3">
                                                <SingleStarRating rating={4} size={20} />
                                                <p className="text-[14px] font-bold text-[#C9A94D]">4.0</p>
                                                <p className="text-[13px] text-[#C9A94D]">Host Rating</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={handleChatWithHost} disabled={isChatLoading} className="flex items-center gap-2 font-light text-white text-xl md:text-2xl bg-[#C9A94D] hover:bg-[#af8d28] rounded-xl h-auto py-4 px-6 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
                                            {isChatLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    Starting...
                                                </div>
                                            ) : (
                                                <>
                                                    <MessagesSquare className="md:h-6 md:w-6 h-5 w-5" />
                                                    Chat with Host
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Location section */}
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12 border-b border-[#C9A94D]">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Location</h1>
                            <div className="p-5 bg-[#434D64]">
                                <div className="mb-6">
                                    {property.coordinates ? (
                                        <iframe width="100%" height="300" loading="lazy" style={{ border: 0 }} allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&hl=es;z=14&output=embed`} />
                                    ) : (
                                        <div className="h-[300px] bg-gray-700 flex items-center justify-center">
                                            <p className="text-white">Location map not available</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-[32px] text-white mb-4 font-bold">Property Location</h1>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[18px] text-white">{property.location}</span>
                                            {property.postCode && <span className="text-[16px] text-gray-300">Post Code: {property.postCode}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Things to know section */}
                        <div className="pb-6 md:pb-12 mb-6 md:mb-12">
                            <h1 className="text-[32px] text-white mb-4 font-bold">Things to know</h1>
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <Image src="/listing/ban.png" alt="House Rules" height={24} width={24}></Image>
                                        <h1 className="text-2xl text-white font-bold">House Rules</h1>
                                    </div>
                                    <p className="text-[18px] text-[#B6BAC3]">Check-in: 3:00 PM | Check-out: 11:00 AM | No smoking | Pets allowed with prior approval</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <Image src="/listing/heart-pulse.png" alt="Health & Safety" height={24} width={24}></Image>
                                        <h1 className="text-2xl text-white font-bold">Health & Safety</h1>
                                    </div>
                                    <p className="text-[18px] text-[#B6BAC3]">Smoke detectors installed | First aid kit available | Emergency contact information provided</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <Image src="/listing/menu-right-square-alt.png" alt="Cancellation Policy" height={24} width={24}></Image>
                                    <h1 className="text-2xl text-white font-bold">Cancellation Policy</h1>
                                </div>
                                <p className="text-[18px] text-[#B6BAC3]">Free cancellation up to 48 hours before check-in. After that, 50% refund up to 24 hours before check-in.</p>
                            </div> */}
                            {property?.termsAndConditions?.content && (
                                <div className="">
                                    {/* <div className="flex items-center gap-4 mb-4">
                                        <Image src="/listing/document.png" alt="Terms and Conditions" height={24} width={24} />
                                        <h1 className="text-2xl text-white font-bold">Terms and Conditions</h1>
                                    </div> */}
                                    <div
                                        className="text-[18px] text-[#B6BAC3] prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: property.termsAndConditions.content,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column - 1/3 sticky */}
                    <div className="md:w-2/8">
                        <div className="md:sticky top-24 z-10">
                            <div className="border border-[#C9A94D] rounded-[20px] bg-[#E8E9EC] py-4 px-8 mb-10">
                                <h1 className="text-[32px] mb-2 font-bold">£{property.price}</h1>
                                <div className="flex items-center gap-2 mb-6">
                                    <SingleStarRating rating={4} size={20} />
                                    <p className="text-sm font-bold text-[#C9A94D]">4.0</p>
                                    <p className="text-sm text-[#C9A94D]">(0 reviews)</p>
                                </div>

                                <Button onClick={handleBookNow} disabled={isChatLoading} className="w-full bg-[#C9A94D] text-white py-3 rounded-[6px] hover:bg-[#af8d28] transition disabled:bg-gray-400">
                                    {isChatLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        "Book Now"
                                    )}
                                </Button>

                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogContent className="sm:max-w-md rounded-none border border-[#D4BA71] bg-[#14213D]">
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
                                            <DialogTitle className="text-xl font-bold text-white mb-6 text-center">Almost there! Create a free account in seconds to secure your stay and start chatting with the host.</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="mb-8 flex items-center justify-center">
                                                <Link href="/auth/register">
                                                    <button className="bg-[#C9A94D] text-white px-[54px] py-[10px] rounded-[8px] font-bold">Sign Up</button>
                                                </Link>
                                            </div>
                                            <p className="text-center text-white text-xl font-bold">Already Have an Account?</p>
                                            <div className="flex items-center justify-center">
                                                <Link href="/auth/login">
                                                    <button className="bg-[#626A7D] text-white px-[54px] py-[10px] rounded-[8px] font-bold">Sign In</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <p className="text-[13px] mt-3 text-center">Awaiting host confirmation before payment.</p>
                            </div>

                            {/* Ask a Question Section - Updated */}
                            <div className="border border-[#C9A94D] rounded-[20px] bg-[#E8E9EC] py-4 px-8 mb-10">
                                <h1 className="text-[32px] font-bold mb-8">Ask a Question?</h1>
                                <textarea className="border border-[#C9A94D] placeholder:text-[#14213D] text-[#14213D] p-3 w-full h-32 mb-8 resize-none focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" placeholder="Contact the host - they'll be happy to help." value={question} onChange={(e) => setQuestion(e.target.value)} disabled={isChatLoading} />
                                <button onClick={handleAskQuestion} disabled={!question.trim() || isChatLoading || !property?.createdBy?._id} className="w-full bg-[#C9A94D] text-white py-3 rounded-[6px] hover:bg-[#af8d28] transition flex items-center gap-3 justify-center disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isChatLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Sending...
                                        </div>
                                    ) : (
                                        <>
                                            <MessagesSquare className="h-6 w-6" />
                                            Chat with Host
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
