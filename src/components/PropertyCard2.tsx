import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IProperty } from "@/types/property";

interface PropertyCardProps {
    property: IProperty;
    status?: string;
}

export default function PropertyCard({ property, status = "For rent" }: PropertyCardProps) {
    const { _id, title, location, price, coverPhoto, propertyType, maxGuests, bedrooms, bathrooms } = property;

    // Fix image URL handling
    const getImageUrl = () => {
        if (!coverPhoto) return "/proparties/default.png";

        // If coverPhoto is already a full URL, use it directly
        if (coverPhoto.startsWith("http")) {
            return coverPhoto;
        }

        // If it's a relative path, prepend the base API URL
        return `${process.env.NEXT_PUBLIC_BASE_API || ""}${coverPhoto}`;
    };

    const imageUrl = getImageUrl();

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
                <span className="absolute top-3 left-3 bg-[#C9A94D] text-white text-sm font-medium px-3 py-1 rounded-[6px]">{status}</span>
            </div>

            <CardContent className="bg-[#FAF6ED] p-5">
                {/* Rating - Removed since your API might not have rating/reviews */}
                <div className="flex items-center mb-2 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${
                                i < 4 // Default 4 stars since rating might not be in API
                                    ? "fill-[#C9A94D] text-[#C9A94D]"
                                    : "text-gray-300"
                            }`}
                        />
                    ))}
                    <span className="ml-2 text-sm font-medium">4.0</span>
                    <span className="ml-1 text-xs text-gray-500">(0 reviews)</span>
                </div>

                <h2 className="text-lg font-bold text-[#14213D] line-clamp-1">{title}</h2>
                <p className="text-sm text-gray-600 line-clamp-1">{location}</p>
                <p className="text-sm text-[#C9A94D] font-medium mt-1">{propertyType}</p>

                {/* Icons */}
                <div className="flex gap-8 my-4 text-[#C9A94D] text-sm">
                    <div>
                        <div className="flex items-center gap-2">
                            <Image src="/proparties/bed.png" alt="Bedrooms" width={20} height={20} />
                            <span>{bedrooms || 1} </span>
                        </div>
                        <p>Bedrooms</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <Image src="/proparties/bathroom.png" alt="Bathrooms" width={20} height={20} />
                            <span>{bathrooms || 1}</span>
                        </div>
                        <p>Bathrooms</p>
                    </div>
                </div>

                {/* Price + Button */}
                <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-[#14213D]">
                        Starting From <span className="text-black">£{price?.toLocaleString() || "0"}</span>
                    </p>
                    <Link href={`/listings/${_id}`}>
                        <Button className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-8 py-2 rounded-[6px] cursor-pointer">Details</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
