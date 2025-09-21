import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { Property } from "@/types/proparty";

interface PropertyCardProps {
    property: Property;
    status?: string; // optional, default to "For rent"
}

export default function PropertyCard({ property, status = "For rent" }: PropertyCardProps) {
    const { title, rating, reviews, address, rooms, bathrooms, price_per_night, images } = property;
    const image = images[0] || "/proparties/default.png";
    return (
        <Card className="overflow-hidden shadow-md border-0 gap-0 rounded-[10px] py-0 bg-[#FAF6ED]">
            <div className="relative h-64 w-full">
                <Image src={image} alt={title} fill className="object-cover" />
                <span className="absolute top-3 left-3 bg-[#C9A94D] text-white text-sm font-medium px-3 py-1 rounded-[6px]">{status}</span>
            </div>

            <CardContent className="bg-[#FAF6ED] p-5">
                <div className="flex items-center mb-2 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? "fill-[#C9A94D] text-[#C9A94D]" : "text-gray-300"}`} />
                    ))}
                    <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
                    <span className="ml-1 text-xs text-gray-500">({reviews} reviews)</span>
                </div>

                <h2 className="text-lg font-bold text-[#14213D]">{title}</h2>
                <p className="text-sm text-gray-600">{address}</p>

                {/* Icons */}
                <div className="flex gap-8 my-4 text-[#C9A94D] text-sm">
                    <div>
                        <div className="flex items-center gap-2">
                            <Image src="/proparties/bed.png" alt="Bedrooms" width={20} height={20} />
                            <span>{rooms} </span>
                        </div>
                        <p>Bedrooms</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <Image src="/proparties/bathroom.png" alt="Bathrooms" width={20} height={20} />
                            <span>{bathrooms}</span>
                        </div>
                        <p>Bathrooms</p>
                    </div>
                </div>

                {/* Price + Button */}
                <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-[#14213D]">
                        Starting From <span className="text-black">${price_per_night.toLocaleString()}</span>
                    </p>
                    <Button className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-8 py-2 rounded-[6px]">Details</Button>
                </div>
            </CardContent>
        </Card>
    );
}
