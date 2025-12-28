import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IProperty } from "@/types/property";
import { useGetPropertyRatingStatsQuery } from "@/redux/features/rating/ratingApi";

interface PropertyCardProps {
    property: IProperty;
    status?: string;
}

export default function PropertyCard({ property, status = "For Rent" }: PropertyCardProps) {
    const { _id, title, location, price, coverPhoto, propertyType, maxGuests, bedrooms, bathrooms, amenities } = property;
    console.log(property);

    const { data: ratingStats, isLoading } = useGetPropertyRatingStatsQuery(_id);

    // Fix image URL handling
    const getImageUrl = () => {
        if (!coverPhoto) return "/proparties/default.png";
        if (coverPhoto.startsWith("http")) {
            return coverPhoto;
        }
        return `${process.env.NEXT_PUBLIC_BASE_API || ""}${coverPhoto}`;
    };

    const imageUrl = getImageUrl();

    console.log(property.createdBy);

    // console.log(property?.featured, property?.trending);

    return (
        <Card className="overflow-hidden shadow-md border-0 gap-0 rounded-[10px] py-0 bg-[#FAF6ED]">
            <div className="relative h-64 w-full">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                        console.log("Image failed to load:", imageUrl);
                        (e.target as HTMLImageElement).src = "/proparties/default.png";
                    }}
                />
                {property.createdBy.verificationStatus === "approved" && (property?.featured ? <span className="absolute top-3 left-3 bg-[#C9A94D] text-white text-sm font-medium px-6 py-2 rounded-[6px]">Featured</span> : property?.trending ? <span className="absolute top-3 left-3 bg-[#0096FF] text-white text-sm font-medium px-6 py-2 rounded-[6px]">Trending</span> : null)}
            </div>

            <CardContent className="bg-[#FAF6ED] p-5">
                {isLoading ? (
                    <div className="flex items-center mb-2 gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                        ))}
                        <div className="ml-2 h-4 w-10 bg-gray-200 rounded animate-pulse" />
                    </div>
                ) : ratingStats?.data && ratingStats.data.totalRatings > 0 ? (
                    <div className="flex items-center mb-2 gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.round(ratingStats.data.averageRating) ? "fill-[#C9A94D] text-[#C9A94D]" : "text-gray-300"}`} />
                        ))}
                        <span className="ml-2 text-sm font-medium text-[#C9A94D]">{ratingStats.data.averageRating.toFixed(1)}</span>
                        <span className="ml-1 text-xs text-[#C9A94D]">({ratingStats.data.totalRatings} reviews)</span>
                    </div>
                ) : (
                    <div className="flex items-center mb-2 gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-[#C9A94D]" />
                        ))}
                        <span className="ml-2 text-sm text-[#C9A94D]">No reviews yet</span>
                    </div>
                )}

                <h2 className="text-lg font-bold text-[#14213D] line-clamp-1">{title}</h2>
                <p className="text-sm text-gray-600 line-clamp-1">{location}</p>
                <p className="text-sm text-[#C9A94D] font-medium mt-1">{propertyType}</p>

                {/* Icons */}
                <div className="flex items-center gap-3 my-4 text-[#C9A94D] text-sm">
                    {/* Max Guests */}
                    <div className="flex items-center gap-2">
                        <Image src="/listing/cardicon/1.svg" alt="Max Guests" width={20} height={20} />
                        <span>{maxGuests || 1}</span>
                    </div>

                    {/* Separator */}
                    <span className="text-[#C9A94D]">|</span>

                    {/* Bedrooms */}
                    <div className="flex items-center gap-2">
                        <Image src="/listing/cardicon/5.svg" alt="Bedrooms" width={20} height={20} />
                        <span>{bedrooms || 1}</span>
                    </div>

                    {/* Separator */}
                    <span className="text-[#C9A94D]">|</span>

                    {/* Bathrooms */}
                    <div className="flex items-center gap-2">
                        <Image src="/listing/cardicon/4.svg" alt="Bathrooms" width={20} height={20} />
                        <span>{bathrooms || 1}</span>
                    </div>

                    {/* Separator */}
                    <span className="text-[#C9A94D]">|</span>

                    {/* Pet Friendly */}
                    <div className="flex items-center gap-2">{amenities?.includes("Pet Friendly") ? <Image src="/listing/cardicon/2.svg" alt="Pet Allowed" width={20} height={20} /> : <Image src="/listing/cardicon/3.svg" alt="No Pets" width={20} height={20} />}</div>
                </div>

                {/* Price + Button */}
                <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-[#14213D]">
                        From <span className="text-black">£{price?.toLocaleString() || "0"}</span>/night
                    </p>
                    <Link href={`/listings/${_id}`}>
                        <Button className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-8 py-2 rounded-[6px] cursor-pointer">View Nest</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
